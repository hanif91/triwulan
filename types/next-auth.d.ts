import { DefaultSession,DefaultUser } from "next-auth";
import { JWT,DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user : {
      id : number,
      role : string,
      name : string,
      username : string,
    } & DefaultSession
  }

  interface User extends DefaultUser {
    username : string,
    role : string,
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id : number,
    role : string
  }
}