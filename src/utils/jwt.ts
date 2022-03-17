import jwt from 'jsonwebtoken';
import config from 'config';

export function signJwt(
  object: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined
) {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    'base64'
  ).toString('ascii');

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

// verifying a jwt is a bit annoying because we don't know what will come out on the other side
// by default... decoded: string | jwt.JwtPayload // but we don't actually know what that is
// so we use a generic
export function verifyJwt<T>(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString(
    'ascii'
  );

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
