'use client'

import Logo from '@/components/logo';

import { iconsMenus } from '@/data/icons-menu';
import  SideMenuData  from '@/data/side-menuData';
import ItemMenu from './item-menu';
import ItemSubMenu from './item-submenu';



export default function Sidebar() {

  return (
    <>
      {/* sidebar desktop */}
      <div className='hidden lg:block'>
        <div className="sticky bg-background flex top-0 h-12 border-b-2 justify-between">
          <div className="flex-1 w-5/6 my-auto items-start pl-1">
            <Logo wid={60} />
          </div>

        </div>

        <div className='flex flex-col h-auto gap-1 mt-3 overflow-auto'>
          {SideMenuData.map((sidemenu,index) =>(
            !sidemenu.path ? (
              <ItemSubMenu title={sidemenu.title} icon={iconsMenus[sidemenu.iconsid]} path={sidemenu.path || "/"} key={sidemenu.id} menu={sidemenu} indexmenu={index} flagmobile={0}/>
            ) : (
              <ItemMenu title={sidemenu.title} icon={iconsMenus[sidemenu.iconsid]} path={sidemenu.path || "/"} key={sidemenu.id} flagmobile={0}/>    
            )

          ))}
      

        </div>
      </div>


              {/* sidebar tablet */}
      <div className='block lg:hidden'>
        <div className="sticky bg-background flex top-0 h-12  border-b-2 justify-between">
          <div className="flex-1 w-5/6 my-auto items-start pl-1">
            <Logo wid={60}/>
          </div>

        </div>

        <div className='flex flex-col h-auto  gap-1 mt-3 overflow-auto'>
          {SideMenuData.map((sidemenu,index) =>(
            !sidemenu.path ? (
              <ItemSubMenu title={sidemenu.title} icon={iconsMenus[sidemenu.iconsid]} path={sidemenu.path || "/"} key={sidemenu.id} menu={sidemenu} indexmenu={index} flagmobile={0}/>
            ) : (
              <ItemMenu title={sidemenu.title} icon={iconsMenus[sidemenu.iconsid]} path={sidemenu.path || "/"} key={sidemenu.id} flagmobile={0}/>    
            )

          ))}
      

        </div>
      </div>

    </>
  );
}
