'use client'
import Link from 'next/link'
import { SideMenu } from "@/types/menu";
import { useState } from "react";
import UseStateMenu from '@/hooks/UseStateMenu';
import { ArrowDown } from 'lucide-react';
import { iconSubMenus } from '@/data/icons-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';


interface PropsItemSubMenu {
  title : string,
  icon : React.ReactElement,
  path: string,
  menu?: SideMenu,
  indexmenu : number,
  flagmobile : number
}

export default function ItemSubmenu(props : PropsItemSubMenu) {
  const stateSubMenu = UseStateMenu()
  const [toogleSubMenu, setToogleSubMenu] = useState<Boolean[]>(stateSubMenu)
  let content : any;


  const handleSubmenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const array = toogleSubMenu.slice();
    array[index] = !array[index];
    setToogleSubMenu(array);
    console.log(array)
  };

  if(props.flagmobile === 1) { 
    content = (
      <div

      className="inline-block mx-0 flex-auto w-full h-auto  px-0 lg:pl-2 lg:pr-1 py-0 border-0 hover-outline text-sm"
      key={`dib1 ${props.menu?.id}`}
    >
      <div className="block">
        <div
          className={`flex flex-col gap-1 pb-3  ${
            toogleSubMenu[props.indexmenu]
              ? 'max-h-44 h-auto'
              : ' max-h-9 overflow-hidden'
          } cursor-pointer transition-max-height duration-500 overflow-hidden`}
          onClick={(e) => handleSubmenu(e, props.indexmenu)}
          key={props.menu?.id}
        >
          <div className="flex flex-row ml-1 w-full" key={`dib2-${props.menu?.id}`}>

        
              <div className="flex my-auto mx-auto lg:mx-0 w-9 h-9">
                {props.icon}
              </div>
              <div className="flex-1 w-full text-start my-auto pl-1 ">
                {props.menu?.title}
              </div>
         
              <div className="flex-none my-auto w-9 h-9 pt-1  ">
                <ArrowDown
                  className={`h-7 w-7 mx-auto my-auto  ${
                    toogleSubMenu[props.indexmenu] ? 'rotate-180' : ' rotate-0 '
                  } cursor-pointer transition-all duration-500`}
                />
              </div>


 
          </div>

          {props.menu?.submenu?.map((smenu) => (
            <SheetClose asChild>
              <Link
                className=""
      
                href={smenu.path || '/'}
              >
                <Button variant="outline" type='submit' className='justify-start items-start text-start place-content-start border-0 flex flex-row pl-2 text-sm w-full '          key={smenu.id}>
                <div className="flex my-auto w-6 h-6">
                  {iconSubMenus[smenu.iconsid]}
                </div>
                <div className="flex-1 w-full my-auto pl-1 ">{smenu.title}</div>
                </Button>
              </Link>
            </SheetClose>
          ))}
        </div>
      </div>   
    </div>   
    )
  } else {
    content = (
    <div

      className="inline-block mx-0 flex-auto w-full h-auto  px-0 lg:pl-2 lg:pr-1 py-0 border-0 hover-outline text-sm"
      key={`dib1 ${props.menu?.id}`}
    >
      <div className="hidden lg:block">
        <div
          className={`flex flex-col gap-1 pb-3  ${
            toogleSubMenu[props.indexmenu]
              ? 'max-h-44 h-auto'
              : ' max-h-9 overflow-hidden'
          } cursor-pointer transition-max-height duration-500 overflow-hidden`}
          onClick={(e) => handleSubmenu(e, props.indexmenu)}
          key={props.menu?.id}
        >
          <div className="flex flex-row  w-full" key={`dib2-${props.menu?.id}`}>

        
              <div className="flex my-auto mx-auto lg:mx-0 w-9 h-9">
                {props.icon}
              </div>
              <div className="flex-1 w-full text-start my-auto pl-1 hidden lg:block">
                {props.menu?.title}
              </div>
         
              <div className="flex-none my-auto w-9 h-9 pt-1 md:hidden lg:block ">
                <ArrowDown
                  className={`h-7 w-7 mx-auto my-auto  ${
                    toogleSubMenu[props.indexmenu] ? 'rotate-180' : ' rotate-0 '
                  } cursor-pointer transition-all duration-500`}
                />
              </div>


 
          </div>

          {props.menu?.submenu?.map((smenu) => (
            <Button variant="outline" className='inline-block justify-start items-start text-start place-content-start border-0 '          key={smenu.id}>
              <Link
                className="flex flex-row pl-2 text-sm "
      
                href={smenu.path || '/'}
              >
                <div className="flex my-auto w-6 h-6">
                  {iconSubMenus[smenu.iconsid]}
                </div>
                <div className="flex-1 w-full my-auto pl-1 ">{smenu.title}</div>
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* tablet Navigation */}
      <div className="block lg:hidden">
        <Button
          variant="outline"

          className={`inline-block flex-auto w-full h-full  px-1 lg:pl-2 lg:pr-1 py-0 border-0`}
          key={`md-${props.menu?.id}`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-row ">
                <div className="flex my-auto mx-auto lg:mx-0 w-9 h-9">
                  {props.icon}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel> {props.title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {props.menu?.submenu?.map((smenu) => (
                <DropdownMenuItem key={`md-${smenu.id}`}>
                  <Link
                    className="flex flex-row text-sm"
                    href={smenu.path || '/'}
                  >
                    <div className="flex my-auto w-6 h-6">
                      {iconSubMenus[smenu.iconsid]}
                    </div>
                    <div className="flex-1 w-full my-auto pl-1 ">
                      {smenu.title}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
      </div>
    </div>
    )
  }


  return content;
}
