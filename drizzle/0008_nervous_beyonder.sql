CREATE TABLE "admin_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_automation_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"type" varchar(30) NOT NULL,
	"conversation_id" uuid,
	"remote_jid" varchar(100),
	"success" boolean DEFAULT true,
	"details" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_conversations" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"remote_jid" varchar(100) NOT NULL,
	"push_name" varchar(255),
	"phone_number" varchar(50),
	"profile_pic_url" text,
	"customer_id" uuid,
	"unread_count" integer DEFAULT 0,
	"last_message_at" timestamp with time zone,
	"last_message_preview" text,
	"is_archived" boolean DEFAULT false,
	"ai_enabled" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_conversations_remote_jid_unique" UNIQUE("remote_jid")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"message_id" varchar(255),
	"remote_jid" varchar(100) NOT NULL,
	"sender" varchar(20) NOT NULL,
	"content" text,
	"message_type" varchar(30) DEFAULT 'text',
	"media_url" text,
	"media_mime_type" varchar(100),
	"media_file_name" varchar(255),
	"is_from_me" boolean DEFAULT false,
	"is_read" boolean DEFAULT false,
	"status" varchar(20) DEFAULT 'SENT',
	"quoted_message_id" varchar(255),
	"quoted_content" text,
	"is_starred" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"is_forwarded" boolean DEFAULT false,
	"metadata" jsonb,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_messages_message_id_unique" UNIQUE("message_id")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_settings" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_templates" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" varchar(50),
	"content" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "whatsapp_automation_logs" ADD CONSTRAINT "whatsapp_automation_logs_conversation_id_whatsapp_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."whatsapp_conversations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_customer_id_crm_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."crm_customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_conversation_id_whatsapp_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."whatsapp_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_wa_log_type" ON "whatsapp_automation_logs" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_wa_log_created_at" ON "whatsapp_automation_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_wa_log_conv" ON "whatsapp_automation_logs" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_wa_conv_remote_jid" ON "whatsapp_conversations" USING btree ("remote_jid");--> statement-breakpoint
CREATE INDEX "idx_wa_conv_customer" ON "whatsapp_conversations" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_wa_conv_last_msg" ON "whatsapp_conversations" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "idx_wa_msg_conversation" ON "whatsapp_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_wa_msg_remote_jid" ON "whatsapp_messages" USING btree ("remote_jid");--> statement-breakpoint
CREATE INDEX "idx_wa_msg_timestamp" ON "whatsapp_messages" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_wa_msg_message_id" ON "whatsapp_messages" USING btree ("message_id");