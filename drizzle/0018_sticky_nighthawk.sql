DROP TABLE `message_reaction`;--> statement-breakpoint
ALTER TABLE reaction ADD `source_id` integer NOT NULL;--> statement-breakpoint
ALTER TABLE reaction ADD `source_type` text NOT NULL;
