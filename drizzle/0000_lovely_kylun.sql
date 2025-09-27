CREATE TABLE `analytics` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`page_url` text NOT NULL,
	`page_title` varchar(255),
	`user_agent` text,
	`ip_address` varchar(45),
	`referrer` text,
	`session_id` varchar(255),
	`user_id` int,
	`device_type` varchar(20),
	`browser` varchar(50),
	`country` varchar(100),
	`city` varchar(100),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `backups` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`filename` varchar(255) NOT NULL,
	`size` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`status` varchar(20) NOT NULL,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `backups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`color` varchar(7) DEFAULT '#6366f1',
	`icon` varchar(50),
	`parent_id` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`sort_order` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `categories_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`content` text NOT NULL,
	`author_name` varchar(100) NOT NULL,
	`author_email` varchar(255) NOT NULL,
	`author_website` varchar(255),
	`post_id` int,
	`news_id` int,
	`parent_id` int,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`is_anonymous` boolean DEFAULT false,
	`ip_address` varchar(45),
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`long_description` text,
	`country` varchar(100) NOT NULL,
	`region` varchar(100),
	`coordinates` json,
	`featured_image` text,
	`images` json,
	`best_time_to_visit` varchar(255),
	`currency` varchar(10),
	`language` varchar(100),
	`timezone` varchar(50),
	`visa_info` text,
	`author_id` int NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`is_featured` boolean DEFAULT false,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`seo_title` varchar(60),
	`seo_description` varchar(160),
	`seo_keywords` text,
	`view_count` int DEFAULT 0,
	`rating` int,
	CONSTRAINT `destinations_id` PRIMARY KEY(`id`),
	CONSTRAINT `destinations_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `destinations_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`filename` varchar(255) NOT NULL,
	`original_name` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`thumbnail_url` text,
	`mime_type` varchar(100) NOT NULL,
	`size` int NOT NULL,
	`width` int,
	`height` int,
	`alt` text,
	`caption` text,
	`folder` varchar(100) DEFAULT 'general',
	`uploaded_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featured_image` text,
	`author_id` int NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`is_breaking` boolean DEFAULT false,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`seo_title` varchar(60),
	`seo_description` varchar(160),
	`view_count` int DEFAULT 0,
	CONSTRAINT `news_id` PRIMARY KEY(`id`),
	CONSTRAINT `news_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `news_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `news_to_categories` (
	`news_id` int NOT NULL,
	`category_id` int NOT NULL,
	CONSTRAINT `news_to_categories_pk` UNIQUE(`news_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscriptions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`first_name` varchar(100),
	`last_name` varchar(100),
	`is_active` boolean NOT NULL DEFAULT true,
	`subscription_source` varchar(100) DEFAULT 'website',
	`preferences` json,
	`unsubscribed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscriptions_email_unique` UNIQUE(`email`),
	CONSTRAINT `newsletter_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`priority` varchar(20) NOT NULL DEFAULT 'medium',
	`read` boolean NOT NULL DEFAULT false,
	`action_url` text,
	`metadata` json,
	`user_id` int,
	`recipient_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featured_image` text,
	`author_id` int NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`is_featured` boolean DEFAULT false,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`seo_title` varchar(60),
	`seo_description` varchar(160),
	`seo_keywords` text,
	`view_count` int DEFAULT 0,
	`like_count` int DEFAULT 0,
	`comment_count` int DEFAULT 0,
	`reading_time` int,
	`difficulty` varchar(20),
	`location` varchar(255),
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `posts_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `posts_to_categories` (
	`post_id` int NOT NULL,
	`category_id` int NOT NULL,
	CONSTRAINT `posts_to_categories_pk` UNIQUE(`post_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `posts_to_tags` (
	`post_id` int NOT NULL,
	`tag_id` int NOT NULL,
	CONSTRAINT `posts_to_tags_pk` UNIQUE(`post_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` json,
	`description` text,
	`category` varchar(50) DEFAULT 'general',
	`is_public` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`),
	CONSTRAINT `settings_key_idx` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `social_posts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`platform` varchar(50) NOT NULL,
	`content` text NOT NULL,
	`image_url` text,
	`post_url` text,
	`scheduled_at` timestamp,
	`published_at` timestamp,
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`engagement` json,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`color` varchar(7) DEFAULT '#10b981',
	`usage_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `tags_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`username` varchar(100) NOT NULL,
	`password_hash` text NOT NULL,
	`first_name` varchar(100),
	`last_name` varchar(100),
	`avatar` text,
	`bio` text,
	`role` varchar(50) NOT NULL DEFAULT 'user',
	`is_active` boolean NOT NULL DEFAULT true,
	`last_login` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `analytics` ADD CONSTRAINT `analytics_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `backups` ADD CONSTRAINT `backups_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_parent_id_categories_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_news_id_news_id_fk` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_parent_id_comments_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `destinations` ADD CONSTRAINT `destinations_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media` ADD CONSTRAINT `media_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `news` ADD CONSTRAINT `news_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `news_to_categories` ADD CONSTRAINT `news_to_categories_news_id_news_id_fk` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `news_to_categories` ADD CONSTRAINT `news_to_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_recipient_id_users_id_fk` FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts_to_categories` ADD CONSTRAINT `posts_to_categories_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts_to_categories` ADD CONSTRAINT `posts_to_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts_to_tags` ADD CONSTRAINT `posts_to_tags_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts_to_tags` ADD CONSTRAINT `posts_to_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `social_posts` ADD CONSTRAINT `social_posts_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `analytics_url_idx` ON `analytics` (`page_url`);--> statement-breakpoint
CREATE INDEX `analytics_session_idx` ON `analytics` (`session_id`);--> statement-breakpoint
CREATE INDEX `analytics_user_idx` ON `analytics` (`user_id`);--> statement-breakpoint
CREATE INDEX `analytics_timestamp_idx` ON `analytics` (`timestamp`);--> statement-breakpoint
CREATE INDEX `backups_status_idx` ON `backups` (`status`);--> statement-breakpoint
CREATE INDEX `backups_type_idx` ON `backups` (`type`);--> statement-breakpoint
CREATE INDEX `categories_parent_idx` ON `categories` (`parent_id`);--> statement-breakpoint
CREATE INDEX `comments_post_idx` ON `comments` (`post_id`);--> statement-breakpoint
CREATE INDEX `comments_news_idx` ON `comments` (`news_id`);--> statement-breakpoint
CREATE INDEX `comments_parent_idx` ON `comments` (`parent_id`);--> statement-breakpoint
CREATE INDEX `comments_status_idx` ON `comments` (`status`);--> statement-breakpoint
CREATE INDEX `destinations_author_idx` ON `destinations` (`author_id`);--> statement-breakpoint
CREATE INDEX `destinations_status_idx` ON `destinations` (`status`);--> statement-breakpoint
CREATE INDEX `destinations_country_idx` ON `destinations` (`country`);--> statement-breakpoint
CREATE INDEX `media_filename_idx` ON `media` (`filename`);--> statement-breakpoint
CREATE INDEX `media_folder_idx` ON `media` (`folder`);--> statement-breakpoint
CREATE INDEX `media_uploader_idx` ON `media` (`uploaded_by`);--> statement-breakpoint
CREATE INDEX `news_author_idx` ON `news` (`author_id`);--> statement-breakpoint
CREATE INDEX `news_status_idx` ON `news` (`status`);--> statement-breakpoint
CREATE INDEX `news_published_idx` ON `news` (`published_at`);--> statement-breakpoint
CREATE INDEX `newsletter_active_idx` ON `newsletter_subscriptions` (`is_active`);--> statement-breakpoint
CREATE INDEX `notifications_type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `notifications_priority_idx` ON `notifications` (`priority`);--> statement-breakpoint
CREATE INDEX `notifications_read_idx` ON `notifications` (`read`);--> statement-breakpoint
CREATE INDEX `notifications_recipient_idx` ON `notifications` (`recipient_id`);--> statement-breakpoint
CREATE INDEX `notifications_created_idx` ON `notifications` (`created_at`);--> statement-breakpoint
CREATE INDEX `posts_author_idx` ON `posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `posts_published_idx` ON `posts` (`published_at`);--> statement-breakpoint
CREATE INDEX `posts_featured_idx` ON `posts` (`is_featured`);--> statement-breakpoint
CREATE INDEX `settings_category_idx` ON `settings` (`category`);--> statement-breakpoint
CREATE INDEX `social_platform_idx` ON `social_posts` (`platform`);--> statement-breakpoint
CREATE INDEX `social_status_idx` ON `social_posts` (`status`);--> statement-breakpoint
CREATE INDEX `social_scheduled_idx` ON `social_posts` (`scheduled_at`);--> statement-breakpoint
CREATE INDEX `tags_name_idx` ON `tags` (`name`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_username_idx` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);