import { signJwt } from '../utils/jwt';
import { omit } from 'lodash';
import prisma from '../utils/prisma';
import { User } from '@prisma/client';

const privateFields = [
  'password',
  'verificationCode',
  'passwordResetCode',
  'verified',
];

export async function createSession({ userId }: { userId: string }) {
  return prisma.session.create({ data: { userId, valid: true } });
}

export async function findSessionById(id: string) {
  const session = prisma.session.findUnique({ where: { id } , include: { User: true }});

  return session;
}

// FIXME-TS type of user was DocumentType<User>
export function signAccessToken(user: User) {
  const payload = omit(user, privateFields);
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
    { session: session.id },
    'refreshTokenPrivateKey',
    {
      expiresIn: '1y',
    }
  );
  return refreshToken;
}
