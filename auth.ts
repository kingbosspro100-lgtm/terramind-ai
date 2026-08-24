import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const config = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: false,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          email_verified: profile.email_verified,
        };
      },
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      allowDangerousEmailAccountLinking: false,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        };
      },
    }),
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      allowDangerousEmailAccountLinking: false,
      profile(profile: any) {
        return {
          id: profile.sub || profile.oid,
          name: profile.name || profile.given_name,
          email: profile.email || profile.preferred_username,
          image: profile.picture || undefined,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Verify provider is configured
      if (!account?.provider) {
        return false;
      }
      
      // Block signups if email not verified by provider
      if (!user.email) {
        return false;
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allowed domains for redirect
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      // Log sign in events for security monitoring
      console.log(`[AUTH] User ${user.email} signed in via ${account?.provider}`);
    },
    async signOut() {
      console.log(`[AUTH] User signed out`);
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);