CREATE TABLE `reaction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
