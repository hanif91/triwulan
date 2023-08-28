'use client'


import { useEffect, useState } from "react"



export const TitleProvider = ({title} : {title : string}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true)},[]);

  if (!isMounted) {
    return null
  }

  return (
    <>
      <h1 className='p-1' >{title}</h1>
    </>
  )
};