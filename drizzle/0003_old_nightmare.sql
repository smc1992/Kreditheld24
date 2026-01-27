ALTER TABLE "crm_customers" ADD COLUMN "password_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "is_active_user" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "last_login" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "reset_token" varchar(255);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "reset_token_expires" timestamp with time zone;