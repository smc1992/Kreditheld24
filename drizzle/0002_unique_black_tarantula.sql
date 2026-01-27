CREATE TABLE "crm_emails" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"customer_id" uuid,
	"case_id" uuid,
	"message_id" varchar(255),
	"direction" varchar(10) NOT NULL,
	"from_address" varchar(255) NOT NULL,
	"to_address" varchar(255) NOT NULL,
	"subject" varchar(512),
	"html_content" text,
	"text_content" text,
	"status" varchar(20) DEFAULT 'received',
	"is_read" boolean DEFAULT false,
	"has_attachments" boolean DEFAULT false,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_settings" (
	"id" varchar(50) PRIMARY KEY DEFAULT 'system_config' NOT NULL,
	"appearance" jsonb DEFAULT '{"theme":"emerald","compactMode":false,"darkMode":false}'::jsonb,
	"notifications" jsonb DEFAULT '{"newCustomer":true,"caseUpdate":true,"systemWarnings":false,"documentUpload":false}'::jsonb,
	"smtp" jsonb DEFAULT '{"server":"smtp.resend.com","fromName":"Kreditheld24 Team","fromEmail":"onboarding@resend.dev"}'::jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"category" varchar(50) DEFAULT 'custom',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crm_activities" ALTER COLUMN "case_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "crm_documents" ALTER COLUMN "case_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD COLUMN "customer_id" uuid;--> statement-breakpoint
ALTER TABLE "crm_cases" ADD COLUMN "form_data" jsonb;--> statement-breakpoint
ALTER TABLE "crm_cases" ADD COLUMN "current_step" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "crm_documents" ADD COLUMN "customer_id" uuid;--> statement-breakpoint
ALTER TABLE "crm_emails" ADD CONSTRAINT "crm_emails_customer_id_crm_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."crm_customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_emails" ADD CONSTRAINT "crm_emails_case_id_crm_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."crm_cases"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_crm_emails_customer" ON "crm_emails" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_crm_emails_direction" ON "crm_emails" USING btree ("direction");--> statement-breakpoint
CREATE INDEX "idx_crm_emails_msg_id" ON "crm_emails" USING btree ("message_id");--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_customer_id_crm_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."crm_customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_documents" ADD CONSTRAINT "crm_documents_customer_id_crm_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."crm_customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_crm_activities_customer" ON "crm_activities" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_crm_documents_customer" ON "crm_documents" USING btree ("customer_id");