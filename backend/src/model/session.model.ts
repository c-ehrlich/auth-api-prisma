import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model';

export class Session {
  @prop({ ref: () => User }) // Mongoose definition
  user: Ref<User>; // TS definition

  // if a session becomes invalid, we set this to false
  // and then we no longer allow creating reset tokens for that session
  @prop({ default: true })
  valid: boolean;
}

// a different way to add options to a model with typegoose
// in user.model we used `modelOptions`, which is another way of doing
// basically the same thing
const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});

export default SessionModel;
