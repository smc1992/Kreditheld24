CREATE TABLE "credit_applications" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" varchar(255) NOT NULL,
	"form_data" jsonb NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_verifications" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"token" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"form_data" jsonb,
	"verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP + INTERVAL '24 hours' NOT NULL,
	CONSTRAINT "email_verifications_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "interest_rates" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"source" varchar(50) NOT NULL,
	"kreditart" varchar(100) NOT NULL,
	"bank" varchar(100) NOT NULL,
	"min_zins" numeric(5, 2) NOT NULL,
	"max_zins" numeric(5, 2) NOT NULL,
	"rep_zins" numeric(5, 2) NOT NULL,
	"laufzeit_min" integer NOT NULL,
	"laufzeit_max" integer NOT NULL,
	"min_summe" integer NOT NULL,
	"max_summe" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scraping_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"source" varchar(50) NOT NULL,
	"success" boolean NOT NULL,
	"rate_count" integer DEFAULT 0,
	"error_message" text,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_credit_applications_email" ON "credit_applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_credit_applications_status" ON "credit_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_credit_applications_created_at" ON "credit_applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_email_verifications_token" ON "email_verifications" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_email_verifications_email" ON "email_verifications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_email_verifications_expires_at" ON "email_verifications" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_interest_rates_source" ON "interest_rates" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_interest_rates_kreditart" ON "interest_rates" USING btree ("kreditart");--> statement-breakpoint
CREATE INDEX "idx_interest_rates_created_at" ON "interest_rates" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_interest_rates_source_date" ON "interest_rates" USING btree ("source","created_at");--> statement-breakpoint
CREATE INDEX "idx_scraping_logs_source" ON "scraping_logs" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_scraping_logs_created_at" ON "scraping_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_scraping_logs_success" ON "scraping_logs" USING btree ("success");