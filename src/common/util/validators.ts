import { z } from "zod";

export const RelationalKeySchema = z.number().int().min(-1);
export type RelationalKey = z.infer<typeof RelationalKeySchema>;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Database relational key.
 */
export function isRelationalKey(arg: unknown): arg is number {
  return typeof arg === "number" && Number.isInteger(arg) && arg >= -1;
}

/**
 * Convert to date object then check is a validate date.
 */
export const DateSchema = z.preprocess(
  (arg) =>
    typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
  z.date(),
);

export const createArrayComparator = <T extends object>(
  props: readonly (keyof T)[],
) => {
  return (a: T[], b: T[]): boolean => {
    if (a.length !== b.length) return false;

    return a.every((item, i) =>
      props.every((prop) => item[prop] === b[i][prop]),
    );
  };
};
