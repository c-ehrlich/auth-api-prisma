// controllers don't talk to DB, services do

import argon2 from 'argon2';
import { CreateUserInput } from '../schema/user.schema';
import prisma from '../utils/prisma';

export async function createUser(input: CreateUserInput) {
  const { password, passwordConfirmation, email, ...rest } = input;

  const hash = await argon2.hash(password);

  const data = { password: hash, email: email.toLocaleLowerCase(), ...rest };

  const user = await prisma.user.create({ data });

  console.log('user', user);

  return user;
}

export async function findUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  return user;
}
