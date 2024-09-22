import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Tabulka uživatelů
export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  nickname: text('nickname').notNull(),
  passwordHash: text('password_hash').notNull(),  // camelCase pro ORM
  token: text('token'),
  tokenExpires: text('token_expires'),
  isEmailVerified: integer('is_email_verified').default(0).notNull(),
  isOnline: integer('is_online').default(0).notNull(),
  userLevel: integer('user_level').default(1).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),  // Výchozí hodnota pro createdAt
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),  // Výchozí hodnota pro updatedAt
});

// Tabulka pro Strength kategorii
export const strengthTable = sqliteTable('strength', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  activityName: text('activity_name').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull(),
  level: integer('level').default(1).notNull(),
  points: integer('points').default(0).notNull(),
  lastXPAdded: text('last_xp_added'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  isActive: integer('isActive').default(1).notNull(),
});

// Tabulka pro Dexterity kategorii
export const dexterityTable = sqliteTable('dexterity', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  activityName: text('activity_name').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull(),
  level: integer('level').default(1).notNull(),
  points: integer('points').default(0).notNull(),
  lastXPAdded: text('last_xp_added'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  isActive: integer('isActive').default(1).notNull(),
});

// Tabulka pro Constitution kategorii
export const constitutionTable = sqliteTable('constitution', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  activityName: text('activity_name').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull(),
  level: integer('level').default(1).notNull(),
  points: integer('points').default(0).notNull(),
  lastXPAdded: text('last_xp_added'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  isActive: integer('isActive').default(1).notNull(),
});

// Tabulka pro Intelligence kategorii
export const intelligenceTable = sqliteTable('intelligence', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  activityName: text('activity_name').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull(),
  level: integer('level').default(1).notNull(),
  points: integer('points').default(0).notNull(),
  lastXPAdded: text('last_xp_added'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  isActive: integer('isActive').default(1).notNull(),
});

// Tabulka pro Wisdom kategorii
export const wisdomTable = sqliteTable('wisdom', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  activityName: text('activity_name').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull(),
  level: integer('level').default(1).notNull(),
  points: integer('points').default(0).notNull(),
  lastXPAdded: text('last_xp_added'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  isActive: integer('isActive').default(1).notNull(),
});

// Tabulka pro Charisma kategorii
export const charismaTable = sqliteTable('charisma', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  activityName: text('activity_name').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull(),
  level: integer('level').default(1).notNull(),
  points: integer('points').default(0).notNull(),
  lastXPAdded: text('last_xp_added'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  isActive: integer('isActive').default(1).notNull(),
});
