CREATE TABLE `strength` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`last_xp_added` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
