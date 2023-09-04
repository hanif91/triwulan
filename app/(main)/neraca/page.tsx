'use client'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import  NeracaSchema   from "@/lib/form-neraca"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { PeriodeData } from "@/types/extra"
import { useEffect, useState } from "react"


// export const getServerSideProps: GetServerSideProps<{
//   periodeData: PeriodeData[]
// }> = async () => {
//   const res = await fetch('http://localhost:3000/api/extra/periode')
//   const periodeData = await res.json()
//   return { props: { periodeData } }
// }
 

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const


export default function page() {
  const [periodeData, setPeriodeData] = useState<PeriodeData[]>([])
  const form = useForm<z.infer<typeof NeracaSchema>>({
    resolver: zodResolver(NeracaSchema),
  })


  useEffect(() => {

    const fetchPeriode = async () => {
      const res = await fetch('http://localhost:3000/api/extra/periode')
      const periodeData = await res.json()
      setPeriodeData(periodeData)
    }
    
    
    fetchPeriode();
  }, [])

  console.log(periodeData)
  async function onSubmit(values: z.infer<typeof NeracaSchema>) {
    // console.log(periodeData)
  }
  return (
    <>
      <div className="w-full h-full mx-2 my-4 overflow-auto ">
    
      <Form {...form} >
              <form onSubmit={form.handleSubmit(onSubmit)}  className='w-full'>
                <div className='space-y-3'>
                  <FormField
                    control={form.control}
              
                    name="periode"
                    render={({ field }) => (
                      <FormItem className='space-y-5 flex flex-col'>
                        <FormLabel>Username</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? languages.find(
                                      (language) => language.value === field.value
                                    )?.label
                                  : "Select language"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search framework..." />
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {periodeData.map((language) => (
                                  <CommandItem
                                    value={language.nama || ""}
                                    key={language.periode}
                                    onSelect={() => {
                                      form.setValue("periode", language.periode)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        language.periode === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {language.nama}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" variant={'default'} className='w-full mt-5'>Submit</Button>
              </form>
            </Form>

      </div>
    </>
  )
}
