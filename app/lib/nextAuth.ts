
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const authOptions:AuthOptions = {
    providers: [ 
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }

        )
    ],
    session: {
        strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60 
},
        jwt: {
        
            
        },
        callbacks: {
            
    } ,
    secret: process.env.NEXTAUTH_SECRET ,
    pages: { 
        signIn: '/auth/signin',
        signOut: '/',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
        newUser: '/auth/new-user',
    }

}