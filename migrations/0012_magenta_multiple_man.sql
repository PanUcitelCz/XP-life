DROP TABLE `user_activities`;--> statement-breakpoint
ALTER TABLE `activities` ADD `user_id` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `activities` ADD `activity_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `activities` ADD `level` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `activities` ADD `points` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `activities` ADD `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `activities` ADD `difficulty` text NOT NULL;--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `activities` DROP COLUMN `name`;