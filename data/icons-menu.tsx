import { Scale,CandlestickChart,Wallet2,GanttChartSquare } from 'lucide-react';


export const iconsMenus : React.ReactElement[] = [
<Scale className='h-8 w-8 mx-auto my-auto'/>,
<CandlestickChart className='h-8 w-8 mx-auto my-auto'/>,
<Wallet2  className='h-8 w-8 mx-auto my-auto'/>,
<GanttChartSquare className='h-8 w-8 mx-auto my-auto'/>];

export const iconSubMenus : React.ReactElement[] = [
  <Scale size={16} className='mx-auto my-auto'/>,
  <CandlestickChart size={16} className=' mx-auto my-auto'/>,
  <Wallet2 size={16} className=' mx-auto my-auto'/>,
  <GanttChartSquare size={16} className='mx-auto my-auto'/>];