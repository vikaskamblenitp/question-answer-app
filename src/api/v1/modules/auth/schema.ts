import z from "zod";
export const schema = {
  registerUser: z.object({
    body: z.object({
      email: z.string().email().trim(),
      first_name: z.string().trim().nonempty(),
      last_name: z.string().trim().nonempty(),
    })
  }),

  loginUser: z.object({
    body: z.object({
      email: z.string().email().trim(),
    }).strict()
  })
}

export type RegisterUserSchema = z.infer<typeof schema.registerUser>["body"];
