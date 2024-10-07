// lib/authOptions.ts

import { Account, AuthOptions, ISODateString, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import axios, { AxiosError } from "axios";

export interface CustomSession {
    user?: CustomUser;
    expires: ISODateString;
    accessToken?: string;
};

export interface CustomUser {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string | null;
    token?: string | null;
    password?: string | null;

}

const LOGIN_URL = 'http://127.0.0.1:8000/user/google-login/';

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || 'your-random-secret-here',
    pages: {
        signIn: "/login",
    },
    callbacks: {
       

        async signIn({ user, account }: { user: CustomUser; account: Account | null }) {
            try {
                if (account?.provider === 'google' && account.id_token) {
                    const payload = {
                        email: user.email!,
                        name: user.name!,
                        oauth_id: account.providerAccountId!,
                        provider: account.provider!,
                        image: user?.image,
                        token: account.id_token, 
                    };
        
                    const { data } = await axios.post(LOGIN_URL, payload);
                    if (data.error) {
                        console.error("Backend error:", data.error);
                        return false;
                    }
                    user.id = data?.user?.id?.toString();
                    user.token = data?.user?.token;
                    user.provider = data?.user?.provider;
                    return true; 
                }
               
            } catch (error) {
                console.error("SignIn Error:", error);
                return false; 
            }
            return false; 
        },


        async jwt({ token, user,account }) {
            // console.log(token,"user" , token.sub )
            if (user) {
                token.user = user;
                // token.accessToken = accessToken;

            }
            // console.log(account , "account")
            if (account?.access_token) {
                token.accessToken = account.access_token;
            }
            
            return token;
        },

        async session({ session, token }) {
            session.user = token.user as CustomUser;
            session.accessToken = token.accessToken;
            return session;
        },
    },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    
};
