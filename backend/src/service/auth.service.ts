import { DocumentType } from '@typegoose/typegoose';
import SessionModel from '../model/session.model';
import { privateFields, User } from '../model/user.model';
import { signJwt } from '../utils/jwt';
import { omit } from 'lodash';

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);
  const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '15m',
  });
  return accessToken;
}

export async function signRefreshToken({ userId }: { userId: string }) {
  // create a session
  const session = await createSession({
    userId,
  });

  // sign a refresh token
  const refreshToken = signJwt(
    { session: session._id },
    'refreshTokenPrivateKey',
    {
      expiresIn: '1y',
    }
  );
  return refreshToken;
}
