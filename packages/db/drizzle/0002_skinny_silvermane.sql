ALTER TABLE "students" RENAME COLUMN "team_owner_id" TO "team_owned_id";--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_team_owner_id_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ouid" text;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_team_owned_id_teams_id_fk" FOREIGN KEY ("team_owned_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_ouid_unique" UNIQUE("ouid");