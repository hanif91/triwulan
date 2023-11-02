import React from 'react'
import Logo from '@/components/logo'
import Image from 'next/image'
import { logos } from '@/data/DataImages'

type Props = {
  judul : string,
  periode : string
}

const HeaderLap = (props: Props) => {
  
  const myLogo = logos[0].src;
  return (
    <div className='inline-block my-2 w-full'>
      <div className="flex ml-1 items-start justify-start my-auto gap-4">
        <div className="flex items-start">
          {/* <Image
            src={logos[0].src}
            alt="logo"
            width={50}
            height={logos[0].height}
            className='bg-none'
          /> */}
            <img src={myLogo} width={75} alt='logo'></img> 

                  {/* <Image
            src={myLogo}
            alt="logo"
            width={75}
            height={logos[0].height}
            className='bg-none'
          /> */}
          <div className={`my-0 ml-1 p-0 hidden lg:block`} >
            <p className={`text-sm tracking-wider uppercase text-teal-800 font-bold`}>
              Perumda air minum Bayuangga
            </p>
            <p className={`text-sm tracking-wider uppercase text-teal-800 font-bold`}>
              Kota Probolinggo
            </p>
          </div>
        </div>
      </div>
      <div className="flex ml-1 mt-2 items-start justify-center my-auto gap-4">
        {props.judul}
      </div>
      <div className="flex ml-1 mb-2 items-start justify-center my-auto gap-4">
        Periode : {props.periode}
      </div>

    </div>
  )
}
export default HeaderLap