import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions, User } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // ✅ This saves Google users to DB
  session: {
    strategy: "jwt", // ✅ override the default
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (isValid) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          } as User;
        }

        throw new Error("Incorrect password");
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // ✅ Callbacks go here (not inside providers)
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }

      // When session is updated via updateSession
      if (trigger === "update" && session?.user) {
        // Make sure all fields from session.user are copied to token
        token.name = session.user.name;
        token.email = session.user.email;
        if (session.user.image !== undefined) {
          token.image = session.user.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        // Copy other fields from token to session
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string | null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin", // optional: your custom sign-in page
  },
};

// ✅ For server-side access to the session
export const auth = async () => {
  return await getServerSession(authConfig);
};
