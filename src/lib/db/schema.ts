import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Tabulka uživatelů
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

// Tabulka aktivit
export const activitiesTable = sqliteTable('activities', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(), // Název aktivity
  category: text('category').notNull(), // Kategorie (Intelligence, Strength, Dexterity, Hobbies)
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// Tabulka aktivit uživatele
export const userActivitiesTable = sqliteTable('user_activities', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(), // Reference na uživatele
  activityId: integer('activity_id').references(() => activitiesTable.id).notNull(), // Reference na aktivitu
  level: integer('level').default(1).notNull(), // Úroveň uživatele v aktivitě
  points: integer('points').default(0).notNull(), // Body, které uživatel nasbíral v aktivitě
  lastXPAdded: text('last_xp_added'), // Datum posledního přidání XP (pro kontrolu, zda už přidal body dnes)
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});