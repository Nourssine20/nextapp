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
      session.user.id = token.sub || ''; // Assurez-vous que token.sub n'est pas undefined
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },
  },
});
