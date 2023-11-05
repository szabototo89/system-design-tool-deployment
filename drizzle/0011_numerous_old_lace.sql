CREATE TABLE `message_reaction` (
	`message_id` integer,
	`reaction_id` integer,
	FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reaction_id`) REFERENCES `reaction`(`id`) ON UPDATE no action ON DELETE no action
);
