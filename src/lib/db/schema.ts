import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').unique().notNull(),
  nickname: text('nickname').unique().notNull(),
  password_hash: text('password_hash').notNull(),
  token: text('token'), // Sloupec pro resetovací token
  tokenExpires: text('token_expires'), // Sloupec pro expiraci tokenu
  isEmailVerified: integer('is_email_verified').default(0).notNull(),
  isOnline: integer('is_online').default(0).notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});
