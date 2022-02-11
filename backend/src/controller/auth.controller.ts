import { Request, Response } from 'express';
import { createSessionInput } from '../schema/auth.schema';
import { signAccessToken, signRefreshToken } from '../service/auth.service';
import { findUserByEmail } from '../service/user.service';
// if you integrate another auth strategy such as oauth, this controller would handle all that logic

export async function createSessionHandler(
  req: Request<{}, {}, createSessionInput>,
  res: Response
) {
  // Intentionally vague
  const message = 'Invalid email or password';

  // we know we have these because we typed ReqBody as createSessionInput
  // password is the candidate password from the login
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send('Please verify your email');
  }

  // this method is on the user model
  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  // sign an access token
  const accessToken = signAccessToken(user);

  // sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id });

  // send the tokens
  return res.send({
    accessToken,
    refreshToken,
  });
}
