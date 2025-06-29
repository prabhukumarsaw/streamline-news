import { and, eq } from "drizzle-orm";
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters";
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from '@/db/schema';

export function DrizzleAdapter(): Adapter {
  return {
    async createUser(data: Partial<AdapterUser> & { email: string; name?: string; image?: string; emailVerified?: Date | null }) {
      const user = await db.insert(users).values({
        email: data.email,
        username: data.email.split('@')[0], // Generate username from email
        passwordHash: '', // Will be set during registration
        firstName: data.name?.split(' ')[0] || '',
        lastName: data.name?.split(' ').slice(1).join(' ') || '',
        displayName: data.name,
        avatarUrl: data.image,
        emailVerified: data.emailVerified ? true : false,
        status: 'active',
      }).returning();

      return {
        id: user[0].id,
        email: user[0].email,
        name: user[0].displayName,
        image: user[0].avatarUrl,
        emailVerified: user[0].emailVerified ? new Date() : null,
      };
    },

    async getUser(id: string) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.displayName,
        image: user.avatarUrl,
        emailVerified: user.emailVerified ? new Date() : null,
      };
    },

    async getUserByEmail(email: string) {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.displayName,
        image: user.avatarUrl,
        emailVerified: user.emailVerified ? new Date() : null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
      const account = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.providerAccountId, providerAccountId),
          eq(accounts.provider, provider)
        ),
        with: {
          user: true,
        },
      });

      if (!account?.user) return null;

      const user = account.user as any; // Type assertion for now

      return {
        id: user.id,
        email: user.email,
        name: user.displayName,
        image: user.avatarUrl,
        emailVerified: user.emailVerified ? new Date() : null,
      };
    },

    async updateUser(data: Partial<AdapterUser> & { id: string }) {
      if (!data.id) throw new Error("No user id");

      const user = await db.update(users)
        .set({
          email: data.email,
          displayName: data.name,
          avatarUrl: data.image,
          emailVerified: data.emailVerified ? true : false,
          updatedAt: new Date(),
        })
        .where(eq(users.id, data.id))
        .returning();

      return {
        id: user[0].id,
        email: user[0].email,
        name: user[0].displayName,
        image: user[0].avatarUrl,
        emailVerified: user[0].emailVerified ? new Date() : null,
      };
    },

    async deleteUser(userId: string) {
      await db.delete(users).where(eq(users.id, userId));
    },

    async linkAccount(account: AdapterAccount) {
      await db.insert(accounts).values({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refreshToken: account.refresh_token,
        accessToken: account.access_token,
        expiresAt: account.expires_at,
        tokenType: account.token_type,
        scope: account.scope,
        idToken: account.id_token,
        sessionState: account.session_state,
      });
    },

    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
      await db.delete(accounts).where(
        and(
          eq(accounts.providerAccountId, providerAccountId),
          eq(accounts.provider, provider)
        )
      );
    },

    async createSession({ sessionToken, userId, expires }: { sessionToken: string; userId: string; expires: Date }) {
      const session = await db.insert(sessions).values({
        sessionToken,
        userId,
        expires,
      }).returning();

      return {
        sessionToken: session[0].sessionToken,
        userId: session[0].userId,
        expires: session[0].expires,
      };
    },

    async getSessionAndUser(sessionToken: string) {
      const sessionAndUser = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, sessionToken),
        with: {
          user: true,
        },
      });

      if (!sessionAndUser?.user) return null;

      const user = sessionAndUser.user as any; // Type assertion for now

      return {
        session: {
          sessionToken: sessionAndUser.sessionToken,
          userId: sessionAndUser.userId,
          expires: sessionAndUser.expires,
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.displayName,
          image: user.avatarUrl,
          emailVerified: user.emailVerified ? new Date() : null,
        },
      };
    },

    async updateSession({ sessionToken, ...data }: { sessionToken: string; expires?: Date }) {
      const session = await db.update(sessions)
        .set({
          expires: data.expires,
        })
        .where(eq(sessions.sessionToken, sessionToken))
        .returning();

      return {
        sessionToken: session[0].sessionToken,
        userId: session[0].userId,
        expires: session[0].expires,
      };
    },

    async deleteSession(sessionToken: string) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },

    async createVerificationToken({ identifier, expires, token }: { identifier: string; expires: Date; token: string }) {
      const verificationToken = await db.insert(verificationTokens).values({
        identifier,
        token,
        expires,
      }).returning();

      return {
        identifier: verificationToken[0].identifier,
        token: verificationToken[0].token,
        expires: verificationToken[0].expires,
      };
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
      try {
        const verificationToken = await db.delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, identifier),
              eq(verificationTokens.token, token)
            )
          )
          .returning();

        return verificationToken.length > 0
          ? {
              identifier: verificationToken[0].identifier,
              token: verificationToken[0].token,
              expires: verificationToken[0].expires,
            }
          : null;
      } catch (err) {
        throw new Error("Verification token not found");
      }
    },
  };
}