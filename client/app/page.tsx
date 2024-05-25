import { Vortex } from "@/components/ui/vortex";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";
import { FlipWords } from "@/components/ui/flip-words";

export default function Home() {
  const words = ["better", "cute", "beautiful", "modern"];
  return (
    <div className=" mx-auto w-screen  h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={100}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
          Image Uploader
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link href={'/login'}>

          <Button borderRadius="1.75rem" className="bg-white md:text-xl dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800">
            Login
          </Button>
          </Link>
          <Link href={'/signup'}>

          <Button borderRadius="1.75rem" className="bg-white md:text-xl dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800">
            Sign Up
          </Button>
          </Link>
        </div>
        {/* <div className="text-2xl mt-4 mx-auto font-normal text-white">
          Build
          <FlipWords words={words} /> 
          websites with Image Uploader
        </div> */}
      </Vortex>
    </div>
  );
}
