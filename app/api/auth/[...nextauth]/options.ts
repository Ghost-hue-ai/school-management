import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { NextAuthOptions } from "next-auth";
import UserModel from "@/app/models/UserModel";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/app/dbConnect/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            return NextResponse.json(
              {
                error: "user not found",
                success: false,
              },
              { status: 400 }
            );
          }
          if (!user.isVerified) {
            return NextResponse.json(
              {
                error: "user is not verified",
                success: false,
              },
              { status: 400 }
            );
          }
          const passwordMatched = bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatched) {
            return NextResponse.json(
              {
                error: "incorrect password",
                success: false,
              },
              { status: 400 }
            );
          }

          return user;
        } catch (error: any) {
          return NextResponse.json(
            {
              error: error.message,
              success: false,
            },
            { status: 500 }
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.email = user.email;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
  pages: { signIn: "sign-in" },
  session: { strategy: "jwt" },
  secret: process.env.NEXT_AUTH_SECRET,
};
