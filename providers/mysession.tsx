"use client"
 

import { useEffect, useState } from "react"

import { SessionProvider } from "next-auth/react"
 
export function MySession({ children, session }: { children : React.ReactNode, session : any }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true)},[]);

  if (!isMounted) {
    return null
  }
  return       <SessionProvider session={session}> {children} </SessionProvider>
}