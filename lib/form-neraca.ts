import * as z from "zod"


const NeracaSchema = z.object({
  periode: z.string({required_error : "please select periode"}),
  opsireport : z.string({required_error : "please select Opsi Report"}),
  tanggalreport : z.string({required_error : "please select tanggal"})
})


export default NeracaSchema