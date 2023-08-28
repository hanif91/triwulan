'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useActivePage } from '@/hooks/useActivePage';
import { SheetClose } from '@/components/ui/sheet';

interface PropsItemMenu {
  title : string,
  icon : React.ReactElement,
  path: string,
  flagmobile : number 
}



export default function ItemMenu(props : PropsItemMenu) {
    // const changeTitle = useActivePage().changeTitle;
    // onClick={() => changeTitle(props.title)} 
    let content : any;
    
    if(props.flagmobile === 1) {
      content = (
        <SheetClose asChild>
        
          <Link                              
            href={props.path}
            className=''
          >
            <Button  variant="outline" type='submit' className='inline-block flex-auto w-full h-full px-1 lg:pl-2 lg:pr-1 py-0 justify-start text-start border-0'>
              <div className="flex flex-row">
                <div className='flex h-9 my-auto  mx-auto lg:mx-0  w-9'>
                  {props.icon}
                </div>
                <div className='flex-1 w-full my-auto pl-1 md:hidden lg:block'>{props.title}</div>
              </div>
            </Button>
          </Link> 
     
        </SheetClose>
      )
    } else {
      content = (
      <Button variant="outline" className='inline-block flex-auto w-full h-full px-1 lg:pl-2 lg:pr-1 py-0 justify-start text-start border-0'>
      <Link                              
        href={props.path}
        className=''
      >
        {/* <div className='flex-auto w-full pl-2 pr-1 py-1 bg-slate-300'>  */}
        <div className="flex flex-row">
          <div className='flex h-9 my-auto  mx-auto lg:mx-0  w-9'>

            {props.icon}

          </div>
          <div className='flex-1 w-full my-auto pl-1 md:hidden lg:block'>{props.title}</div>
        </div>
      {/* </div> */}
      </Link>
    </Button>
    )
    }


  return  content
}
