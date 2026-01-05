import { z } from "zod";
import { IModel } from "./common/types";


export interface CreateUserInput {
  name: string;
  email: string;
  avatar?: Uint8Array<ArrayBuffer> | null;
  avatarMime?: string | null;
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
  avatar?: Uint8Array<ArrayBuffer> | null;
  avatarMime?: string | null;
}

/******************************************************************************
                                  Setup
******************************************************************************/

// Initialize the "parseUser" function
export const UserSchema = z.object({
  id: z.number().int().min(-1).default(0),
  name: z.string(),
  email: z.email().or(z.string()),
  created: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().default(() => new Date()),
  ),
  avatar: z.union([
    z.string(),
    z.instanceof(Uint8Array), 
    z.custom<Buffer>((val) => Buffer.isBuffer(val), "Input not instance of Buffer")
  ]).nullish().transform(val => {
    if (typeof val === 'string') return Buffer.from(val) as unknown as Uint8Array<ArrayBuffer>;
    return val as unknown as Uint8Array<ArrayBuffer>;
  }),
  avatarMime: z.string().optional(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  avatar: z
    .instanceof(Uint8Array)
    .optional()
    .nullable(),
  avatarMime: z.string().optional().nullable(),
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
  createSchema: CreateUserSchema,
} as const;