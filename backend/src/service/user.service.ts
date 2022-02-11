// controllers don't talk to DB, services do

import UserModel, { User } from "../model/user.model";

export function createUser(input: Partial<User>) {
  return UserModel.create(input)
}