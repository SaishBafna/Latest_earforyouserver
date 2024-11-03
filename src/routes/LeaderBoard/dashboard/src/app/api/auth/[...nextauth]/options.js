import Credentials from "next-auth/providers/credentials";

import Admin from "../../../lib/AdminModal";
import { connectToDb } from "../../../lib/db";

export const authOptions = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      connectToDb();
      try {
        const findUser = await Admin.findOne({ email: user.email });
        if (findUser) {
          return true;
        }
        await Admin.create({
          email: user.email,
          name: user.name,
        });
        return true;
      } catch (error) {
        console.log("The error is ", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  
  providers: [
    Credentials({
      name: "Welcome Back",
      type: "credentials",
      
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        // * Connect to the MongoDb
        connectToDb();
        const user = await Admin.findOne({ email: credentials?.email });
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
