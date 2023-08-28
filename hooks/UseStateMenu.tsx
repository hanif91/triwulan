
import  { useEffect, useState } from 'react'
import  SideMenuData  from '@/data/side-menuData';

export default function UseStateMenu() {
  const [mounted, setMounted] = useState(false)

  let arr : Boolean[] = []
  useEffect(() => {
    SideMenuData.map(() => {
      arr.push(false);
    })

    setMounted(true)
  }, [])

  if (!mounted) {
    return arr
  } 

  
  return arr;

}
