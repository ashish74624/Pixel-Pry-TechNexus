'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode"; // Updated import statement
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import Folder from '@/components/Folder';


interface tokenType {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  iat: number;
}


const backend = process.env.BACKEND;

export default function Home() {
  const navigate = useRouter();

  const [user, setUser] = useState<tokenType >(); // Initialize with null

  useEffect(() => {
    const verify = async (token: string) => {
      const res = await fetch(`${backend}/api/users/verifyToken`, {
        headers: {
          'x-access-token': token,
        },
      });
      if (!res.ok) {
        navigate.push('/');
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try { // Wrap jwt_decode in a try-catch block for error handling
        const userDecoded = jwtDecode(token) as tokenType;
        console.log(userDecoded)
        setUser(userDecoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        // Handle token decoding errors (e.g., invalid token format)
      }
    }

    verify(token as string);
  }, [navigate]);

  return (
    <div>
      <Navbar userData={user as tokenType}/>
      <Folder userData={user as tokenType} />
    </div>
  );
}
