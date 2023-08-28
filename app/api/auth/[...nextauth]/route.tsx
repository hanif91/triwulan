import NextAuth, {NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

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
        // const { username,password} = credentials as { username : string,password : string};

        // console.log(credentials?.password)
        if(credentials?.username !== "admin" && credentials?.password !== "admin") {
          console.log(credentials?.username)
          return null

        }
        console.log("tes")
        return {id : "1234", name :"admin", username : "admin"}
      }
    }),
    GoogleProvider({
      clientId : process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ]
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }