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
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    profileImage: text('profile_image').default("https://preview.redd.it/new-lore-ekko-or-old-lore-ekko-v0-rk1pnlymql5c1.jpg?width=300&format=pjpg&auto=webp&s=769e3a4b5537853cea944cfb4ccf350320975d18"),
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
    userId: integer('user_id').references(() => usersTable.id).notNull(),  // Cizí klíč na usersTable
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

export const questsTable = sqliteTable('quests', {
    id: integer('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id).notNull(), // Odkaz na uživatele
    title: text('title').notNull(), // Název questu
    description: text('description').notNull(),
    category: text('category').notNull(), // Kategorie
    xp_value: integer('xp_value').default(100),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(), // Datum vytvoření
    isCompleted: integer('is_completed').default(0).notNull() // Příznak, zda byl quest dokončen
});
