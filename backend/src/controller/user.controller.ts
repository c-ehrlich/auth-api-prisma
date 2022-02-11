import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import UserModel from '../model/user.model';
import {
  CreateUserInput,
  ForgotPasswordInput,
  VerifyUserInput,
} from '../schema/user.schema';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from '../service/user.service';
import log from '../utils/logger';
import sendEmail from '../utils/mailer';

// ReqBody = CreateUserInput
export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    await sendEmail({
      // TODO make this your real address for prod
      from: 'test@example.com',
      to: user.email,
      subject: 'Please verify your account',
      text: `Verification code: ${user.verificationCode}
      Id: ${user._id}`,
    });
    return res.send('User successfully created');
  } catch (e: any) {
    if (e.code === 11000) {
      // unique constraint has been violated
      return res.status(409).send('Account already exists');
    }
    return res.status(500).send(e);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const v = req.params.verificationCode;

  // find the user by id
  const user = await findUserById(id);

  if (!user) {
    return res.send('Could not verify user');
  }

  // check to see if they are already verified
  if (user.verified) {
    return res.send('User is already verified');
  }

  // check to see if the verificaiton code matches
  if (user.verificationCode === v) {
    user.verified = true;
    await user.save();
    return res.send('User successfully verified');
  }

  return res.send('Could not verify user');
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const message =
    'If a user with that email is registered you will receive a password reset email';
  const { email } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`User with email ${email} does not exist`);
    return res.send(message);
  }

  // Users should not be able to reset their password if they have not yet verified
  if (!user.verified) {
    return res.send('User is not verified');
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    to: user.email,
    from: 'test@example.com', // TODO make a real email address
    subject: 'Reset your password',
    text: `Password reset code: ${passwordResetCode}
    Id: ${user._id}`,
  });

  log.debug(`Password reset email sent to ${email}`);

  return res.send(message);
}
