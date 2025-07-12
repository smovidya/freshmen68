import z from "zod/v4";

export const groupPreferenceSchema = z.array(
  z.number()
);

