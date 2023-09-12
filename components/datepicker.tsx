import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  FormControl,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export default function DatePicker({onValueChange , defaultValue } : { onValueChange : any, defaultValue? : any}) {
  return (
      <Popover >
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal ",
              !defaultValue && "text-muted-foreground"
            )}
          >
            {defaultValue ? (
              format(defaultValue, "dd MMMM yyyy")
            ) : (
              <span>Select a Date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={defaultValue}
          onSelect={onValueChange}
          // disabled={(date) =>
          //   date > new Date() || date < new Date("1900-01-01")
          // }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
