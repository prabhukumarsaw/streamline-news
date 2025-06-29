import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "./adapter";
import { verifyPassword } from "./password";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { users, userRoles, roles } from "@/db/schema";

export const authConfig: NextAuthOptions = {
  adapter: DrizzleAdapter(),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaCode: { label: "MFA Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          // Find user with roles
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
            with: {
              userRoles: {
                with: {
                  role: true,
                },
              },
            },
          });

          if (!user) {
            throw new Error("User not found");
          }

          // Check account status
          if (user.status !== 'active') {
            throw new Error("Account is not active");
          }

          // Check if account is locked
          if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
            throw new Error("Account is temporarily locked");
          }

          // Verify password
          const isValidPassword = await verifyPassword(credentials.password, user.passwordHash);
          if (!isValidPassword) {
            // Increment login attempts
            await db.update(users)
              .set({
                loginAttempts: (user.loginAttempts || 0) + 1,
                lockedUntil: (user.loginAttempts || 0) >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null, // Lock for 15 minutes after 5 attempts
              })
              .where(eq(users.id, user.id));
            
            throw new Error("Invalid password");
          }

          // Check MFA if enabled
          if (user.mfaEnabled && !credentials.mfaCode) {
            throw new Error("MFA code required");
          }

          if (user.mfaEnabled && credentials.mfaCode) {
            const { verifyMFA } = await import("./mfa");
            const isValidMFA = verifyMFA(user.mfaSecret!, credentials.mfaCode);
            if (!isValidMFA) {
              throw new Error("Invalid MFA code");
            }
          }

          // Reset login attempts on successful login
          await db.update(users)
            .set({
              loginAttempts: 0,
              lockedUntil: null,
              lastLogin: new Date(),
            })
            .where(eq(users.id, user.id));

          return {
            id: user.id,
            email: user.email,
            name: user.displayName || `${user.firstName} ${user.lastName}`,
            image: user.avatarUrl,
            role: user.userRoles[0]?.role?.name || 'public',
            permissions: user.userRoles[0]?.role?.permissions || {},
            mfaEnabled: user.mfaEnabled,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role;
        token.permissions = (user as any).permissions;
        token.mfaEnabled = (user as any).mfaEnabled;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).role = token.role;
        (session.user as any).permissions = token.permissions;
        (session.user as any).mfaEnabled = token.mfaEnabled;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, create/update user
      if (account?.provider !== 'credentials') {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });

        if (!existingUser) {
          // Create new user for OAuth
          await db.insert(users).values({
            email: user.email!,
            username: user.email!.split('@')[0],
            passwordHash: '', // OAuth users don't have passwords
            firstName: profile?.name?.split(' ')[0] || '',
            lastName: profile?.name?.split(' ').slice(1).join(' ') || '',
            displayName: profile?.name || user.name,
            avatarUrl: user.image,
            emailVerified: true,
            status: 'active',
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { user: user.email, provider: account?.provider });
    },
    async signOut({ session, token }) {
      console.log('User signed out:', { user: session?.user?.email });
    },
  },
};