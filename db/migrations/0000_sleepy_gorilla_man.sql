CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`job_id` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`items` text DEFAULT '[]' NOT NULL,
	`issued_at` integer,
	`paid_at` integer,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `job_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`job_id` text NOT NULL,
	`url` text NOT NULL,
	`caption` text DEFAULT '',
	`created_at` integer,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`scheduled_at` integer NOT NULL,
	`completed_at` integer,
	`notes` text DEFAULT '',
	`created_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
