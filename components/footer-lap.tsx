import { DataTtd } from '@/types/ttd'


type Props = {
  datattd : DataTtd,
  tanggalreport : string,
  kota : string,
}

const FooterLap = (props: Props) => {
  return (
    <div className='inline-block mt-2 mb-2 w-full'>
      <div className="grid grid-cols-3 gap-3">
         {/* ttdkiri */}
        <div className=' text-center text-xs' >
          <p className=' h-5'></p>
          <p >
            {props.datattd.header1}
          </p>
          <p >
            {props.datattd.jab1}
          </p>
          <p className=' h-[65px]'></p>
          <p >
            {props.datattd.nama1}
          </p>
          <p >
            {props.datattd.nik1}
          </p>
        </div>
        {/* ttdtengah */}
        <div className=' text-center text-xs' >
          <p className=' h-5'></p>
          <p >
            {props.datattd.header2}
          </p>
          <p >
            {props.datattd.jab2}
          </p>
          <p className=' h-[65px]'></p>
          <p >
            {props.datattd.nama2}
          </p>
          <p >
            {props.datattd.nik2}
          </p>
        </div>
        {/* ttdkanan */}
        <div className=' text-center text-xs' >
          <p className=' h-5'>Probolinggo, {props.tanggalreport} </p>
          <p >
            {props.datattd.header4}
          </p>
          <p >
            {props.datattd.jab4}
          </p>
          <p className=' h-[65px]'></p>
          <p >
            {props.datattd.nama4}
          </p>
          <p >
            {props.datattd.nik4}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FooterLap