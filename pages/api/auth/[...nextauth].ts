import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async session({ session, token }) {
      // Assurez-vous que token.sub existe avant de l'assigner à session.user.id
      if (token && token.sub) {
        (session.user as { id?: string }).id = token.sub; 
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl + '/profile';
    },
  },
});