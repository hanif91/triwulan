import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fltoNum(val : number) : number {
  return val*1000
}

export function numtoFl(val : number) : number {
  return val/1000
}


export function cariPersentase(bulanini : number,bulanlalu : number) : number {
  if (bulanlalu === 0) {
    return 100
  } else {
    return numtoFl((fltoNum(bulanini)-fltoNum(bulanlalu)))/bulanlalu*100
  }

}

export function formatNumber(val : number) : string {
  const number = parseFloat(val.toFixed(2))
  const formatNum = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
  }).format(number)
  return formatNum

}

