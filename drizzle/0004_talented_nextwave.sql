CREATE TABLE "crm_case_messages" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"case_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"sender_type" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "europace_id" varchar(255);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "email_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "email_verification_token" varchar(255);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "email_verification_expires" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "crm_case_messages" ADD CONSTRAINT "crm_case_messages_case_id_crm_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."crm_cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_crm_case_messages_case" ON "crm_case_messages" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "idx_crm_case_messages_sender" ON "crm_case_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_crm_case_messages_created_at" ON "crm_case_messages" USING btree ("created_at");