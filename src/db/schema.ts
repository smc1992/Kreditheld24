import { pgTable, uuid, varchar, decimal, integer, timestamp, boolean, text, index, jsonb, inet } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Interest Rates Table
export const interestRates = pgTable('interest_rates', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  source: varchar('source', { length: 50 }).notNull(),
  kreditart: varchar('kreditart', { length: 100 }).notNull(),
  bank: varchar('bank', { length: 100 }).notNull(),
  minZins: decimal('min_zins', { precision: 5, scale: 2 }).notNull(),
  maxZins: decimal('max_zins', { precision: 5, scale: 2 }).notNull(),
  repZins: decimal('rep_zins', { precision: 5, scale: 2 }).notNull(),
  laufzeitMin: integer('laufzeit_min').notNull(),
  laufzeitMax: integer('laufzeit_max').notNull(),
  minSumme: integer('min_summe').notNull(),
  maxSumme: integer('max_summe').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sourceIdx: index('idx_interest_rates_source').on(table.source),
  kreditartIdx: index('idx_interest_rates_kreditart').on(table.kreditart),
  createdAtIdx: index('idx_interest_rates_created_at').on(table.createdAt),
  sourceDateIdx: index('idx_interest_rates_source_date').on(table.source, table.createdAt),
}));

// Scraping Logs Table
export const scrapingLogs = pgTable('scraping_logs', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  source: varchar('source', { length: 50 }).notNull(),
  success: boolean('success').notNull(),
  rateCount: integer('rate_count').default(0),
  errorMessage: text('error_message'),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sourceIdx: index('idx_scraping_logs_source').on(table.source),
  createdAtIdx: index('idx_scraping_logs_created_at').on(table.createdAt),
  successIdx: index('idx_scraping_logs_success').on(table.success),
}));

// Email Verifications Table
export const emailVerifications = pgTable('email_verifications', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  token: varchar('token', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  formData: jsonb('form_data'),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP + INTERVAL '24 hours'`).notNull(),
}, (table) => ({
  tokenIdx: index('idx_email_verifications_token').on(table.token),
  emailIdx: index('idx_email_verifications_email').on(table.email),
  expiresAtIdx: index('idx_email_verifications_expires_at').on(table.expiresAt),
}));

// Credit Applications Table
export const creditApplications = pgTable('credit_applications', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  email: varchar('email', { length: 255 }).notNull(),
  formData: jsonb('form_data').notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_credit_applications_email').on(table.email),
  statusIdx: index('idx_credit_applications_status').on(table.status),
  createdAtIdx: index('idx_credit_applications_created_at').on(table.createdAt),
}));

// Admin Users Table
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('admin'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_admin_users_email').on(table.email),
}));

// CRM Customers Table
export const crmCustomers = pgTable('crm_customers', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  salutation: varchar('salutation', { length: 20 }), // HERR, FRAU
  title: varchar('title', { length: 50 }), // Dr., Prof., etc.
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  address: text('address'),
  street: varchar('street', { length: 255 }),
  city: varchar('city', { length: 100 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('Deutschland'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  birthDate: timestamp('birth_date'),
  birthPlace: varchar('birth_place', { length: 255 }),
  maritalStatus: varchar('marital_status', { length: 50 }),
  childrenCount: integer('children_count').default(0),
  occupation: varchar('occupation', { length: 255 }),
  employer: varchar('employer', { length: 255 }),
  monthlyIncome: decimal('monthly_income', { precision: 12, scale: 2 }),
  nationality: varchar('nationality', { length: 100 }),
  notes: text('notes'),
  europaceId: varchar('europace_id', { length: 255 }),
  // Portal Access
  passwordHash: varchar('password_hash', { length: 255 }),
  isActiveUser: boolean('is_active_user').default(false),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  emailVerificationExpires: timestamp('email_verification_expires', { withTimezone: true }),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpires: timestamp('reset_token_expires', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('idx_crm_customers_name').on(table.lastName, table.firstName),
  emailIdx: index('idx_crm_customers_email').on(table.email),
  createdAtIdx: index('idx_crm_customers_created_at').on(table.createdAt),
}));

// CRM Cases Table (Vorgänge)
export const crmCases = pgTable('crm_cases', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  customerId: uuid('customer_id').notNull().references(() => crmCustomers.id, { onDelete: 'cascade' }),
  caseNumber: varchar('case_number', { length: 100 }).notNull().unique(),
  advisorName: varchar('advisor_name', { length: 255 }),
  advisorNumber: varchar('advisor_number', { length: 100 }),
  requestedAmount: decimal('requested_amount', { precision: 12, scale: 2 }),
  approvedAmount: decimal('approved_amount', { precision: 12, scale: 2 }),
  bank: varchar('bank', { length: 255 }),
  duration: integer('duration'),
  followUpDate: timestamp('follow_up_date'),
  status: varchar('status', { length: 50 }).default('open'),
  formData: jsonb('form_data'),
  currentStep: integer('current_step').default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  customerIdx: index('idx_crm_cases_customer').on(table.customerId),
  caseNumberIdx: index('idx_crm_cases_case_number').on(table.caseNumber),
  statusIdx: index('idx_crm_cases_status').on(table.status),
  followUpIdx: index('idx_crm_cases_follow_up').on(table.followUpDate),
}));

// CRM Activities Table (Aktivitätsverlauf)
export const crmActivities = pgTable('crm_activities', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  caseId: uuid('case_id').references(() => crmCases.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => crmCustomers.id, { onDelete: 'cascade' }),
  emailId: uuid('email_id').references(() => crmEmails.id, { onDelete: 'set null' }),
  type: varchar('type', { length: 50 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description'),
  date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => adminUsers.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  caseIdx: index('idx_crm_activities_case').on(table.caseId),
  customerIdx: index('idx_crm_activities_customer').on(table.customerId),
  emailIdx: index('idx_crm_activities_email').on(table.emailId),
  typeIdx: index('idx_crm_activities_type').on(table.type),
  dateIdx: index('idx_crm_activities_date').on(table.date),
}));

// CRM Documents Table (Unterlagen)
export const crmDocuments = pgTable('crm_documents', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  caseId: uuid('case_id').references(() => crmCases.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => crmCustomers.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size'),
  uploadedBy: uuid('uploaded_by').references(() => adminUsers.id),
  isDeletedByCustomer: boolean('is_deleted_by_customer').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  caseIdx: index('idx_crm_documents_case').on(table.caseId),
  customerIdx: index('idx_crm_documents_customer').on(table.customerId),
  typeIdx: index('idx_crm_documents_type').on(table.type),
}));

// CRM Case Messages Table (Customer-Admin Communication)
export const crmCaseMessages = pgTable('crm_case_messages', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  caseId: uuid('case_id').notNull().references(() => crmCases.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull(), // Can be customerId or adminUserId
  senderType: varchar('sender_type', { length: 20 }).notNull(), // 'customer' or 'admin'
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  caseIdx: index('idx_crm_case_messages_case').on(table.caseId),
  senderIdx: index('idx_crm_case_messages_sender').on(table.senderId),
  createdAtIdx: index('idx_crm_case_messages_created_at').on(table.createdAt),
}));

// Email Templates Table
export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: varchar('name', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 50 }).default('custom'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// System Settings Table
export const crmSettings = pgTable('crm_settings', {
  id: varchar('id', { length: 50 }).primaryKey().default('system_config'),
  appearance: jsonb('appearance').default({
    theme: 'emerald',
    compactMode: false,
    darkMode: false
  }),
  notifications: jsonb('notifications').default({
    newCustomer: true,
    caseUpdate: true,
    systemWarnings: false,
    documentUpload: false
  }),
  smtp: jsonb('smtp').default({
    server: 'smtp.resend.com',
    fromName: 'Kreditheld24 Team',
    fromEmail: 'onboarding@resend.dev'
  }),
  signature: text('signature'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Emails Table (Real Inbox/Outbox storage)
export const crmEmails = pgTable('crm_emails', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  customerId: uuid('customer_id').references(() => crmCustomers.id, { onDelete: 'set null' }),
  caseId: uuid('case_id').references(() => crmCases.id, { onDelete: 'set null' }),
  messageId: varchar('message_id', { length: 255 }), // From provider (Resend/IMAP)
  direction: varchar('direction', { length: 10 }).notNull(), // 'inbound' or 'outbound'
  from: varchar('from_address', { length: 255 }).notNull(),
  to: varchar('to_address', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 512 }),
  htmlContent: text('html_content'),
  textContent: text('text_content'),
  status: varchar('status', { length: 20 }).default('received'), // 'received', 'sent', 'failed', 'trash'
  isRead: boolean('is_read').default(false),
  starred: boolean('starred').default(false),
  hasAttachments: boolean('has_attachments').default(false),
  date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  customerIdx: index('idx_crm_emails_customer').on(table.customerId),
  directionIdx: index('idx_crm_emails_direction').on(table.direction),
  msgIdIdx: index('idx_crm_emails_msg_id').on(table.messageId),
}));

// Type exports for TypeScript
export type InterestRate = typeof interestRates.$inferSelect;
export type NewInterestRate = typeof interestRates.$inferInsert;

export type ScrapingLog = typeof scrapingLogs.$inferSelect;
export type NewScrapingLog = typeof scrapingLogs.$inferInsert;

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type NewEmailVerification = typeof emailVerifications.$inferInsert;

export type CreditApplication = typeof creditApplications.$inferSelect;
export type NewCreditApplication = typeof creditApplications.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type CrmCustomer = typeof crmCustomers.$inferSelect;
export type NewCrmCustomer = typeof crmCustomers.$inferInsert;

export type CrmCase = typeof crmCases.$inferSelect;
export type NewCrmCase = typeof crmCases.$inferInsert;

export type CrmActivity = typeof crmActivities.$inferSelect;
export type NewCrmActivity = typeof crmActivities.$inferInsert;

export type CrmDocument = typeof crmDocuments.$inferSelect;
export type NewCrmDocument = typeof crmDocuments.$inferInsert;

export type CrmCaseMessage = typeof crmCaseMessages.$inferSelect;
export type NewCrmCaseMessage = typeof crmCaseMessages.$inferInsert;

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type NewEmailTemplate = typeof emailTemplates.$inferInsert;

export type CrmSetting = typeof crmSettings.$inferSelect;
export type NewCrmSetting = typeof crmSettings.$inferInsert;

// --- Chatbot & RAG Schema ---

// Custom Vector Type for pgvector
import { customType } from 'drizzle-orm/pg-core';

export const vector = customType<{ data: number[] }>({
  dataType() {
    return 'vector(1536)';
  },
  toDriver(value: number[]) {
    return JSON.stringify(value);
  },
  fromDriver(value: unknown) {
    return JSON.parse(value as string);
  },
});

// Chat Sessions
export const chatSessions = pgTable('chat_sessions', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  customerId: uuid('customer_id').references(() => crmCustomers.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).default('open').notNull(), // 'open', 'closed', 'archived'
  aiEnabled: boolean('ai_enabled').default(true).notNull(),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  customerIdx: index('idx_chat_sessions_customer').on(table.customerId),
  statusIdx: index('idx_chat_sessions_status').on(table.status),
  lastMessageIdx: index('idx_chat_sessions_last_message').on(table.lastMessageAt),
}));

// Chat Messages
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  sessionId: uuid('session_id').references(() => chatSessions.id, { onDelete: 'cascade' }).notNull(),
  sender: varchar('sender', { length: 20 }).notNull(), // 'user', 'admin', 'ai'
  content: text('content').notNull(),
  metadata: jsonb('metadata'), // e.g. tokens used, related sources
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sessionIdx: index('idx_chat_messages_session').on(table.sessionId),
  createdAtIdx: index('idx_chat_messages_created_at').on(table.createdAt),
}));

// Knowledge Base (RAG)
export const knowledgeBase = pgTable('knowledge_base', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  content: text('content').notNull(),
  source: varchar('source', { length: 255 }), // e.g. "manual", "faq.pdf", "chat_history"
  embedding: vector('embedding'), // vector(1536)
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Note: HNSW index creation is usually done via raw sql in migration because drizzle support varies
  sourceIdx: index('idx_knowledge_base_source').on(table.source),
}));

// Types
export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

export type KnowledgeBaseItem = typeof knowledgeBase.$inferSelect;
export type NewKnowledgeBaseItem = typeof knowledgeBase.$inferInsert;
