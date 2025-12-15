import { z } from "zod";
import { isRelationalKey } from "@src/common/util/validators";
import { IModel } from "./common/types";

export interface IUser extends IModel {
  name: string;
  email: string;
}

/******************************************************************************
                                 Constants
******************************************************************************/

const DEFAULT_USER_VALS = (): IUser => ({
  id: -1,
  name: "",
  created: new Date(),
  email: "",
});

/******************************************************************************
                                  Types
******************************************************************************/

export interface IUser extends IModel {
  name: string;
  email: string;
}

/******************************************************************************
                                  Setup
******************************************************************************/

// Initialize the "parseUser" function
export const UserSchema = z.object({
  id: z.number().int().min(-1),
  name: z.string(),
  email: z.email().or(z.string()),
  created: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date(),
  ),
});

/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function __new__(user?: Partial<IUser>): IUser {
  const retVal = { ...DEFAULT_USER_VALS(), ...user };

  const result = UserSchema.safeParse(retVal);

  if (!result.success) {
    throw new Error(
      "Setup new user failed " + JSON.stringify(result.error.format(), null, 2),
    );
  }

  return result.data;
}

/**
 * Check is a user object. For the route validation.
 */
function test(arg: unknown): arg is IUser {
  return UserSchema.safeParse(arg).success;
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: __new__,
  test,
  schema: UserSchema,
} as const;
