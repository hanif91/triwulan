import NextAuth, {DefaultUser, User, NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";


interface MyUser  {
  id? : number,
  name? : string | null,
  jabatan? : string | null,
  nik? : string | null
}


const authOptions : NextAuthOptions = {
  session : {
    strategy : 'jwt'
  },
  providers : [
   
    CredentialsProvider({
      type : 'credentials',
      credentials : {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      
      async authorize(credentials, req) {
        var md5 = require('md5');

        try {
          
          if (!credentials?.username || !credentials?.password) {
            // return new NextResponse("Unauthorized", {status : 401 })
            throw new Error("Unauthorized");
          } 

          const user = await prismadb.userakses.findUnique({
            where : {
                  username : credentials?.username,
                  pass : md5(credentials?.password)
            },
            select : {
              id:true,
              nama : true,
              jabatan : true,
              nik : true
            }
          });
          
          if (!user) {
            throw new Error("NotFound");
          }

          const myUser  : MyUser = {
            id : user.id,
            name : user.nama,
            jabatan : user.jabatan,
            nik : user.nik
          }
          
          const usr : User = {
            id: myUser.id?.toString() as string ,
            name : myUser.name, 
            email : "",
            image: "",
            role : myUser.jabatan || ""
          }
          
          return usr
          
        } catch (error) {
          
           throw error;
        }

      }
    }),
    GoogleProvider({
      clientId : process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],  pages: {
    signIn: '/login',
    signOut: '/',
  },
  secret : process.env.NEXTAUTH_SECRET,
  callbacks  : {
    async jwt ( { token, user}) {
      if (user) {
        // console.log({ ...token, id : user.id, role : user.role})
        return { ...token, id : user.id, role : user.role} as any
      }

      return token
    },
    async session({ session,token }){
      // console.log(token)
      return {
        ...session,
        user : {
          ...session.user,
          id : token.id,
          role : token.role
        }
      }
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }