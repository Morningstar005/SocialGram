
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignUpValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
// import { createUserAccount } from "@/lib/appwrite/api"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignUpForm = () => {
  // const isLoading = false;
  const { toast } = useToast()
  const navigate = useNavigate()
  const {checkAuthUser} = useUserContext();
  const {mutateAsync:createUserAccount,isPending:isCreatingUser} = useCreateUserAccount();
  const {mutateAsync:signInAccount} = useSignInAccount();


  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const newUser = await createUserAccount(values)
    if(!newUser){
      return toast({
        title: "Sign yp failed. please try again.",
      })
    }

    const session =await signInAccount({
      email:values.email,
      password:values.password
    })


    if(!session){
      return toast({title:"sign in failed. please try again."})
    }

    const isLoggedIn = await checkAuthUser()

    if(isLoggedIn){
      form.reset();

      navigate('/');
    }else{
      return toast({title:'Sign up Failed. Please try again.'})
    }

    
  }

  return (

    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col ">
        <h1 className='font-bold w-full text-center text-[1.75rem]'>SocialGram</h1>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular">to use SnapGram,Please enter your details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name here" type="text" {...field} className="shad-input" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UserName</FormLabel>
                <FormControl>
                  <Input placeholder="username here" type="text" {...field} className="shad-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email here" type="email" {...field} className="shad-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password here" type="password" {...field} className="shad-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit" className="shad-button_primary">
            {
              isCreatingUser?(
                <div className="flex-center gap-2">
                  <Loader/>Loading...
                </div>
              ):"Sign up"
            }
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2 ">Already have an account ?
            <Link className="text-primary-500 text-small-semibold ml-1" to={"/sign-in"}> Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>

  )
}

export default SignUpForm