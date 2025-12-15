import { z } from "zod";
import { Response } from "supertest";

/******************************************************************************
                                Types
******************************************************************************/
const ValidationErrSchema = z.object({
  message: z.string(),
  errors: z.array(z.unknown()),
});

// Use generics to add properties to 'body'
export type TRes<T = object> = Omit<Response, "body"> & {
  body: T & { error?: string | ValidationErr };
};

export type ValidationErr = z.infer<typeof ValidationErrSchema>;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * JSON parse a validation error.
 */
export function parseValidationErr(arg: unknown): ValidationErr {
  if (typeof arg !== "string") {
    throw new Error("Not a string");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(arg);
  } catch {
    throw new Error("Invalid JSON");
  }

  return ValidationErrSchema.parse(parsed);
}
