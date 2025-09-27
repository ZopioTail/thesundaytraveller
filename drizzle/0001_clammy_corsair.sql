ALTER TABLE `analytics` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` MODIFY COLUMN `recipient_id` int NOT NULL;