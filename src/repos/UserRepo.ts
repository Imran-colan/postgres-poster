import User, { IUser, CreateUserInput } from "@src/models/User";
import { getRandomInt } from "@src/common/util/misc";
import db from "./DB";
/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  return db.user.findUnique({
    where: { email },
  });
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const users = await db.user.findUnique({
    where: { id },
  });
  if (!users) {
    return false;
  }
  return true;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  return db.user.findMany();
}

/**
 * Add one user.
 */
async function add(user: CreateUserInput): Promise<void> {
  await db.user.create({ data: user });
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  await db.user.update({
    where: { id: user.id },
    data: user,
  });
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  await db.user.delete({
    where: { id },
  });
}

// **** Unit-Tests Only **** //

/**
 * Delete every user record.
 */
async function deleteAllUsers(): Promise<void> {
  await db.user.deleteMany({});
}

/**
 * Insert multiple users. Can't do multiple at once cause using a plain file
 * for now.
 */
async function insertMult(users: IUser[] | readonly IUser[]): Promise<IUser[]> {
  const usersF = [...users];
  for (const user of usersF) {
    await db.user.create({ data: user });
  }
  return usersF;
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  deleteAllUsers,
  insertMult,
} as const;
