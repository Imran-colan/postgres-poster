import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number(),
});

const ENV = EnvSchema.parse(process.env);
export default ENV;
