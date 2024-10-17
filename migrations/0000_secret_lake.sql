CREATE TABLE `charisma` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`activity_name` text NOT NULL,
	`description` text NOT NULL,
	`difficulty` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`last_xp_added` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`isActive` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`isActive` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`isActive` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`isActive` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `strength` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`activity_name` text NOT NULL,
	`description` text NOT NULL,
	`difficulty` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`last_xp_added` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`isActive` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`nickname` text NOT NULL,
	`password_hash` text NOT NULL,
	`token` text,
	`token_expires` text,
	`is_email_verified` integer DEFAULT 0 NOT NULL,
	`is_online` integer DEFAULT 0 NOT NULL,
	`user_level` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`profile_image` text DEFAULT 'https://preview.redd.it/new-lore-ekko-or-old-lore-ekko-v0-rk1pnlymql5c1.jpg?width=300&format=pjpg&auto=webp&s=769e3a4b5537853cea944cfb4ccf350320975d18'
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`isActive` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
