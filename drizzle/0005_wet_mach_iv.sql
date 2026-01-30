ALTER TABLE "crm_activities" ADD COLUMN "email_id" uuid;--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "salutation" varchar(20);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "title" varchar(50);--> statement-breakpoint
ALTER TABLE "crm_emails" ADD COLUMN "starred" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "crm_settings" ADD COLUMN "signature" text;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_email_id_crm_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."crm_emails"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_crm_activities_email" ON "crm_activities" USING btree ("email_id");