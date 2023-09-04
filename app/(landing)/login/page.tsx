'use client'
import { ModeToggle } from '@/components/header/toggle-theme'
import Logo from '@/components/logo'
import { signIn, useSession } from 'next-auth/react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { ToastAction } from '@radix-ui/react-toast'
import { CheckCircle2, XCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'




const FormSchema = z.object({
  username: z.string()
  .min(1, "Username is required")
  .min(3, "Username Minimum 3 Character"),
  password : z.string()
  .min(1,"Username is required")
  .min(4,"Password Minim 4 Digit")
})

function Login() {

  const {data : session, status} = useSession( )


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })


  if (status === "authenticated") {
    redirect('/')
  } else if (status === "loading"){
    return null
  }


  async function onSubmit(values: z.infer<typeof FormSchema>) {

    const res = await signIn('credentials', {...values, redirect : false })
    // console.log(res)
    // console.log(typeof res?.error)
    if (res?.error !== "NotFound" || res?.error === null) {
      toast({
        duration : 500,
        title : "Login",
        description: "Login Success" ,
        action : <ToastAction altText='succes'>
          <CheckCircle2 size={24} color="#0b9d30" />
        </ToastAction>
      }) 
    } else {
      toast({
        title : "Login",
        description: "Login Gagal : User Atau Password tidak sesuai" ,
        action : <ToastAction altText='Try again'>
          <XCircle size={24} color="#9d0b12" />
        </ToastAction>
      }) 
    }
  }
  return (
    <div className='container  min-w-[350px] flex h-screen bg-primary-foreground'>
      <div className='m-auto h-auto '>
        <div className="flex w-full place-content-center pb-3">
            <Logo wid={100} textClassName='text-lg' textClassHidden='block lg:block'/>
        </div>

          <div className='flex flex-col m-auto w-96 h-auto border-2 gap-3 py-10 px-5  bg-card'>
            <div className='flex flex-row w-full justify-between'>
              <Label className='text-start text-xl my-auto'> Login Aplikasi Triwulan</Label>
              <div className="text-end"> <ModeToggle /></div>
            </div>
            <Form {...form} >
              <form onSubmit={form.handleSubmit(onSubmit)}  className='w-full'>
                <div className='space-y-3'>
                  <FormField
                    control={form.control}
                  
                    name="username"
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Your UserName" {...field} />
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
                          <Input type='password' placeholder="Enter Your Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" variant={'default'} className='w-full mt-5'>Submit</Button>
              </form>
            </Form>

          </div>
  
      </div>
    </div>
  )
}

export default Login