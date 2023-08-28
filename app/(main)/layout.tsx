
import  Footer  from "@/components/footer"
import  Header  from "@/components/header/Header"
import  Sidebar  from "@/components/sidebar/MySidebar"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="container  min-w-[350px] flex h-screen bg-background">
     
        <div className="hidden md:flex flex-col w-1/5 h-full border-2 min-w-[75px]  max-w-[75px] lg:min-w-[200px] lg:max-w-[250px] shadow-sm shadow-card-foreground">
          <Sidebar/>
        </div>
    

        <div className="flex-1 w-5/6 border ml-1 shadow-sm shadow-card-foreground">
          <div className='flex flex-col w-full '>
            <Header/>
          </div>

          {children}

          
          <div className='flex-1 w-full'>
            <Footer/>
          </div>
        </div>
    </main>
  )
}
