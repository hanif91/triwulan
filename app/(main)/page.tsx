'use client'

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"


export default function Main() {
  const {data : session , status} = useSession()

  // if (status === "unauthenticated") {
  //   redirect('/login')
  // } else if (status === "loading"){
  //   return null
  // }

  return (
    <div>
      Main Page
    </div>
  )
}
