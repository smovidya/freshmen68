ALTER TABLE "teams" ADD COLUMN "team_codes" text NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_result_group_number_available_groups_id_fk" FOREIGN KEY ("result_group_number") REFERENCES "public"."available_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_team_codes_unique" UNIQUE("team_codes");