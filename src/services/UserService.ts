import { RouteError } from "@src/common/util/route-errors";
import HTTP_STATUS_CODES from "@src/common/constants/HTTP_STATUS_CODES";

import UserRepo from "@src/repos/UserRepo";
import { IUser, CreateUserInput } from "@src/models/User";

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = "User not found";

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: CreateUserInput): Promise<IUser> {
  return UserRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<IUser> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(HTTP_STATUS_CODES.NotFound, USER_NOT_FOUND_ERR);
  }
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<IUser> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HTTP_STATUS_CODES.NotFound, USER_NOT_FOUND_ERR);
  }
  // Delete user
  return UserRepo.delete(id);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
