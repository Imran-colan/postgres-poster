import { z, ZodRawShape, ZodTypeAny } from "zod";
import { ValidationError } from "@src/common/util/route-errors";

/******************************************************************************
                              Functions
******************************************************************************/

/**
 * Throw a "ParseObjError" when "parseObject" fails. Also extract a nested
 * "ParseObjError" and add it to the nestedErrors array.
 */

export function parseReq<T extends ZodRawShape>(schema: T) {
  const zodSchema = z.object(schema);

  return (arg: unknown): z.infer<typeof zodSchema> => {
    const result = zodSchema.safeParse(arg);

    if (!result.success) {
      throw new ValidationError(result.error);
    }

    return result.data;
  };
}
