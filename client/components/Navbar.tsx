"use client";
import React, { useState } from "react";
import { Vortex } from "./ui/vortex";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface tokenType {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  iat: number;
}


interface Props {
  userData :tokenType 
}


export function Navbar({userData}:Props) {
  return (
      <nav className="w-full dark text-white py-2 border-b shadow-lg shadow-purple-400/40 border-gray-700 overflow-hidden flex items-center mx-auto">
        <Vortex backgroundColor="black" rangeY={800} particleCount={100} className="flex items-center justify-between px-2 md:px-32  py-4 dark h-full w-full ">
          <p className="text-4xl font-semibold">
            Pixel Pry
          </p>  
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-blue-200 bg-opacity-10 hover:bg-opacity-20 transition-all px-3 py-1 rounded-full">@{userData?.firstName}</DropdownMenuTrigger>
            <DropdownMenuContent className="dark">
              <DropdownMenuLabel>{userData?.firstName} {userData?.lastName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Vortex>
        </nav>
  );
}



