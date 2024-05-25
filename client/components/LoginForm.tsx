'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {z} from 'zod'
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { BackgroundGradient } from './ui/background-gradient';
import Label from './Label';

const backend = process.env.BACKEND;

const schema = z.object({
  email:z.string().email(),
  password: z.string()
});

type FormField = z.infer<typeof schema>

export default function LoginForm() {

    const router = useRouter()
    const { register , handleSubmit , setError ,formState:{errors,isSubmitting}} = useForm<FormField>(
    {
      resolver:zodResolver(schema)
    });
    const onSubmit:SubmitHandler<FormField>=async(data)=>{
    try{
      const res = await fetch(`${backend}/api/users/login`,{
        method:"POST",
        headers:{
          'Content-type':"application/json"
        },
        body:JSON.stringify(data)
      });
      const output = await res.json();
      if(!res.ok){
        setError('root',{
        message:output.msg
      })
      }else{
        localStorage.setItem("token",output.user);
        router.push('/home')
      }
    }catch(err:any){
      setError('root',{
        message:'Bad Request'
      })
    }
  }

  return (
      <div className='w-80'>
        <BackgroundGradient className="rounded-[22px]   bg-zinc-900">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full h-max pb-6 shadow-lg rounded-lg flex flex-col ">
          <h2 className=" font-GraphikBlack font-medium text-3xl mt-6 text-white mb-4 mx-auto">Login</h2>
          <div className="relative z-0 w-[80%] mx-auto group font-GraphikBlack mb-4 ">
            <input {...register('email')} type="text" name="email" className="input-class peer" placeholder=" "  />
            <Label htmlFor='email' text='Email'/>
          </div>
          <div className="relative z-0 w-[80%] mx-auto mb-5 group font-GraphikBlack ">
            <input {...register("password")} type="password" name="password" id="password" className="input-class peer" placeholder=" "  />
            <Label htmlFor='password' text='Password'/>
          </div>
          {/* <p className=" text-sm font-semibold font-GraphikBlack text-[#0FADFF]">Forgot password ?</p> */}
          <button disabled={isSubmitting} className="bg-[#0FADFF] mt-2 mx-16 text-white rounded-full py-2 font-GraphikBlack">{isSubmitting ?'Loading...':"Submit"}</button>
          <p className=" text-sm font-meduim font-GraphikBlack text-white mt-2 w-max mx-auto">Dont have an account yet ? <Link href={'/signup'}><span className="text-[#0FADFF]">Sign up</span></Link>  </p>
          {errors.root && 
          <div className="text-red-500 mx-auto text-sm ">{errors.root?.message}</div> }
          {errors.email && 
          <div className="text-red-500 mx-auto text-sm ">{errors.email?.message}</div> }
          {errors.password && 
          <div className="text-red-500 mx-auto text-sm ">{errors.password?.message}</div> }
        </form>
    </BackgroundGradient>
      
      </div>
  )
}
