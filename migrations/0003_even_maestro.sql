ALTER TABLE `users` ADD `is_email_verified` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_online` integer DEFAULT 0 NOT NULL;