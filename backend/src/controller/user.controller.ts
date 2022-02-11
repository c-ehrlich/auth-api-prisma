import { Request, Response } from 'express';
import UserModel from '../model/user.model';
import { CreateUserInput, VerifyUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';
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

export function findUserById(id: string) {
  return UserModel.findById(id);
}
