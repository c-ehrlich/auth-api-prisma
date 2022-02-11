// export a typescript interface and our model
// all the decorators come from typegoose

import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  pre,
  DocumentType,
  index,
} from '@typegoose/typegoose';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import log from '../utils/logger';

// hash passwords before saving them
@pre<User>('save', async function () {
  if (!this.isModified('password')) return;

  const hash = await argon2.hash(this.password);

  this.password = hash;

  return;
})
@index({ email: 1 }) // put an index on email so findUserByEmail is fast
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    // allow fiels to have multiple types
    // we need this so the password reset code is nullable
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      log.error(e, 'Could not validate password');
      return false;
    }
  }
}

const UserModel = getModelForClass(User);
export default UserModel;
