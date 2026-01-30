import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db, adminUsers, crmCustomers } from '@/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 1. Try Admin Login
          const adminUser = await db
            .select()
            .from(adminUsers)
            .where(eq(adminUsers.email, credentials.email as string))
            .limit(1);

          if (adminUser.length && adminUser[0].active) {
            const isValid = await bcrypt.compare(
              credentials.password as string,
              adminUser[0].passwordHash
            );

            if (isValid) {
              return {
                id: adminUser[0].id,
                email: adminUser[0].email,
                name: adminUser[0].name,
                role: adminUser[0].role || 'admin',
              };
            }
          }

          // 2. Try Customer Login
          const customerUser = await db
            .select()
            .from(crmCustomers)
            .where(eq(crmCustomers.email, credentials.email as string))
            .limit(1);

          if (customerUser.length && customerUser[0].isActiveUser && customerUser[0].passwordHash) {
            const isValid = await bcrypt.compare(
              credentials.password as string,
              customerUser[0].passwordHash
            );

            if (isValid) {
               // Update last login
              await db.update(crmCustomers)
                .set({ lastLogin: new Date() })
                .where(eq(crmCustomers.id, customerUser[0].id));

              return {
                id: customerUser[0].id,
                email: customerUser[0].email,
                name: `${customerUser[0].firstName} ${customerUser[0].lastName}`,
                role: 'customer',
              };
            }
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      
      // Refresh user data from database on update trigger or periodically
      if (trigger === 'update' || !token.lastRefresh || Date.now() - (token.lastRefresh as number) > 60000) {
        try {
          if (token.role === 'customer') {
            const customerUser = await db
              .select()
              .from(crmCustomers)
              .where(eq(crmCustomers.id, token.id as string))
              .limit(1);
            
            if (customerUser.length) {
              token.name = `${customerUser[0].firstName} ${customerUser[0].lastName}`;
              token.email = customerUser[0].email;
            }
          } else if (token.role === 'admin') {
            const adminUser = await db
              .select()
              .from(adminUsers)
              .where(eq(adminUsers.id, token.id as string))
              .limit(1);
            
            if (adminUser.length) {
              token.name = adminUser[0].name;
              token.email = adminUser[0].email;
            }
          }
          token.lastRefresh = Date.now();
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
