'use client'
import { UserCircle2 } from 'lucide-react'
import React from 'react'
import { ModeToggle } from './toggle-theme'
import { Button } from '../ui/button'
import { useActivePage } from '@/hooks/useActivePage'
import { TitleProvider } from '@/providers/title-page-provider'
import { usePathname,useSearchParams } from 'next/navigation'
import { useState,useEffect } from "react"
import  SideMenuData  from '@/data/side-menuData';
import { signOut } from 'next-auth/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Logo from '../logo'
import ItemSubmenu from '@/components/sidebar/item-submenu'
import ItemMenu from '@/components/sidebar/item-menu'
import { iconsMenus } from '@/data/icons-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




export default function Header() {

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const changeTitle = useActivePage().changeTitle

  useEffect(() => {
    let activeTitlePage = "";
    if(pathname !== "/") {
      SideMenuData.map((sidemenu,index) =>{
        if(!sidemenu.path){
          sidemenu.submenu?.map((smenu) => {
            if(smenu.path === pathname ) {
              activeTitlePage=smenu.title;
            }
          })
        } else {
          if(sidemenu.path === pathname ) {
            activeTitlePage=sidemenu.title;
          }
        }
      });
    } else {
      activeTitlePage = "Home" 
    }



    void(changeTitle(`${activeTitlePage}`))
  }, [pathname, searchParams])

  const title = useActivePage().title
  return (
    
    <div className='sticky top-0 h-12 border-b-2'>
      <div className='flex justify-between  h-full'>
        <div className="flex-1 w-5/6 h-auto  my-auto ">
          <div className='flex flex-row m-1'>


            <Sheet>
              <SheetTrigger>
                <div className="flex-none justify-center w-8 p-1 md:hidden lg:hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto my-auto "
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
                </div>
              </SheetTrigger>
              <SheetContent side={'left'}>
                <SheetHeader>
                  <SheetTitle>
                    
                    <div className="flex w-full justify-center">
                      <Logo wid={60} textClassHidden='block lg:block'/>
                    </div>
                  </SheetTitle>
                </SheetHeader>
            
    
                    <div className='flex flex-col h-auto gap-1 mt-3 overflow-auto'>
                      {SideMenuData.map((sidemenu,index) =>(
                        !sidemenu.path ? (
                          <ItemSubmenu title={sidemenu.title} icon={iconsMenus[sidemenu.iconsid]} path={sidemenu.path || "/"} key={sidemenu.id} menu={sidemenu} indexmenu={index} flagmobile={1}/>
                        ) : (
                    
                            <ItemMenu title={sidemenu.title} icon={iconsMenus[sidemenu.iconsid]} path={sidemenu.path || "/"} key={sidemenu.id} flagmobile={1}/> 
                     
                        )

                      ))}
                    </div>
      
              </SheetContent>
          </Sheet>
            <TitleProvider title={title}/>
          </div>

        </div>
      
        <div className="flex-none w-1/5 h-auto  my-auto">
          <div className='flex flex-row m-1 justify-end'>
            <div className='mx-1'>
              <ModeToggle/>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-0 mx-1" size="icon">
                  <UserCircle2 size={26} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Button className="border-0 mx-1 w-full" size="icon" onClick={()=> signOut({ redirect : true , callbackUrl : "/login"}) }>
                    Log Out
                  </Button>              
              </DropdownMenuContent>
            </DropdownMenu>
  
          </div>

        </div>
      </div>
    </div>
  )
}
