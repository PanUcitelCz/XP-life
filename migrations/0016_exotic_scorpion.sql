CREATE TABLE `charisma` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`activity_name` text NOT NULL,
	`description` text NOT NULL,
	`difficulty` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`last_xp_added` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `constitution` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`activity_name` text NOT NULL,
	`description` text NOT NULL,
	`difficulty` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`last_xp_added` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dexterity` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`activity_name` text NOT NULL,
	`description` text NOT NULL,
	`difficulty` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`last_xp_added` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `intelligence` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`activity_name` text NOT NULL,
	`description` text NOT NULL,
	`difficulty` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`last_xp_added` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wisdom` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`activity_name` text NOT NULL,
	`description` text NOT NULL,
	`difficulty` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`last_xp_added` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
