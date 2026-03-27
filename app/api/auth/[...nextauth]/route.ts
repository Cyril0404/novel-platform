import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Demo Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@novelflow.com" },
      },
      async authorize(credentials) {
        if (credentials?.email) {
          return {
            id: "demo-user-1",
            email: credentials.email,
            name: "Demo Reader",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }: { session: any; token: any; user: any }) {
      if (session.user) {
        session.user.id = token.sub || user?.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "novel-platform-secret-key-change-in-production",
});

export { handler as GET, handler as POST };
