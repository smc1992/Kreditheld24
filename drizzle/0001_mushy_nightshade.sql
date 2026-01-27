CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin',
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "crm_activities" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"case_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_cases" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"customer_id" uuid NOT NULL,
	"case_number" varchar(100) NOT NULL,
	"advisor_name" varchar(255),
	"advisor_number" varchar(100),
	"requested_amount" numeric(12, 2),
	"approved_amount" numeric(12, 2),
	"bank" varchar(255),
	"duration" integer,
	"follow_up_date" timestamp,
	"status" varchar(50) DEFAULT 'open',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "crm_cases_case_number_unique" UNIQUE("case_number")
);
--> statement-breakpoint
CREATE TABLE "crm_customers" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"address" text,
	"phone" varchar(50),
	"email" varchar(255),
	"birth_date" timestamp,
	"birth_place" varchar(255),
	"marital_status" varchar(50),
	"children_count" integer DEFAULT 0,
	"nationality" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_documents" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"case_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100),
	"file_url" text NOT NULL,
	"file_size" integer,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_case_id_crm_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."crm_cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_cases" ADD CONSTRAINT "crm_cases_customer_id_crm_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."crm_customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_documents" ADD CONSTRAINT "crm_documents_case_id_crm_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."crm_cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_documents" ADD CONSTRAINT "crm_documents_uploaded_by_admin_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_admin_users_email" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_crm_activities_case" ON "crm_activities" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "idx_crm_activities_type" ON "crm_activities" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_crm_activities_date" ON "crm_activities" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_crm_cases_customer" ON "crm_cases" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_crm_cases_case_number" ON "crm_cases" USING btree ("case_number");--> statement-breakpoint
CREATE INDEX "idx_crm_cases_status" ON "crm_cases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_crm_cases_follow_up" ON "crm_cases" USING btree ("follow_up_date");--> statement-breakpoint
CREATE INDEX "idx_crm_customers_name" ON "crm_customers" USING btree ("last_name","first_name");--> statement-breakpoint
CREATE INDEX "idx_crm_customers_email" ON "crm_customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_crm_customers_created_at" ON "crm_customers" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_crm_documents_case" ON "crm_documents" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "idx_crm_documents_type" ON "crm_documents" USING btree ("type");