import * as z from "zod"
export const SignUpValidation = z.object({
    name:z.string().min(2,{message:"Too Short"}),
    username: z.string().min(6,{message:"Username must be atleast 6 character"}),
    email:z.string().email(),
    password:z.string().min(8,{message:"Password must be at least 8 character"})
  })

  export const SignInValidation = z.object({
    email:z.string().email(),
    password:z.string().min(8,{message:"Password must be at least 8 character"})
  })

  export const CreatePostValidation = z.object({
   caption:z.string().min(5).max(2200),
   file:z.custom<File[]>(),
   location:z.string().min(2).max(200),
   tags:z.string()
  })

