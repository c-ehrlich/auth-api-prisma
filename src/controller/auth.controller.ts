import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { get } from 'lodash';
import { createSessionInput } from '../schema/auth.schema';
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from '../service/auth.service';
import { findUserByEmail, findUserById } from '../service/user.service';
import { verifyJwt } from '../utils/jwt';
import argon2 from 'argon2';
import log from '../utils/logger';
// if you integrate another auth strategy such as oauth, this controller would handle all that logic

export async function createSessionHandler(
  req: Request<{}, {}, createSessionInput>,
  res: Response
) {
  // Intentionally vague
  const message = 'Invalid email or password';

  // we know we have these because we typed ReqBody as createSessionInput
  // password is the candidate password from the login
  const { email, password: candidatePassword } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send('Please verify your email');
  }

  // this method is on the user model
  const isValid = await validatePassword(user, candidatePassword);

  if (!isValid) {
    return res.send(message);
  }

  // sign an access token
  const accessToken = signAccessToken(user);

  // sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user.id });

  // send the tokens
  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  // this needs to actually be in our headers that are sent in the frontend
  // check postman for a sample
  const refreshToken = get(req, 'headers.x-refresh');
  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    'refreshTokenPublicKey'
  );

  if (!decoded) {
    return res.status(401).send('Could not refresh access token');
  }

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) {
    return res.status(401).send('Could not refresh access token');
  }

  const user = await findUserById(session.User.id);

  if (!user) {
    return res.status(401).send('Could not refresh access token');
  }

  const accessToken = signAccessToken(user);

  return res.send({ accessToken });
}

async function validatePassword(user: User, candidatePassword: string) {
  try {
    console.log(user.password);
    console.log(candidatePassword);
    return await argon2.verify(user.password, candidatePassword);
  } catch (e) {
    log.error(e, 'Could not validate password');
    return false;
  }
}
