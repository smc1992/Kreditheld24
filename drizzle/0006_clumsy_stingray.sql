ALTER TABLE "crm_customers" ADD COLUMN "street" varchar(255);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "zip_code" varchar(20);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "country" varchar(100) DEFAULT 'Deutschland';--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "occupation" varchar(255);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "employer" varchar(255);--> statement-breakpoint
ALTER TABLE "crm_customers" ADD COLUMN "monthly_income" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "crm_documents" ADD COLUMN "is_deleted_by_customer" boolean DEFAULT false;