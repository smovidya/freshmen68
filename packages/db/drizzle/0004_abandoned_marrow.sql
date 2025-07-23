ALTER TABLE "user" ADD COLUMN "group" text;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "result" text DEFAULT '' NOT NULL;