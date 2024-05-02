DO $$ BEGIN
 CREATE TYPE "permissionType" AS ENUM('module_chat', 'module_company', 'module_chatbot', 'module_marketing', 'module_client', 'module_settings', 'module_team');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "userType" AS ENUM('dev', 'admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat" (
	"chatID" serial PRIMARY KEY NOT NULL,
	"jid" varchar(32) NOT NULL,
	"waSessionID" varchar(32) NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"clientID" integer,
	"companyID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client" (
	"clientID" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(128) NOT NULL,
	"email" varchar(64) NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"companyID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company" (
	"companyID" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"ownerID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"messageID" serial PRIMARY KEY NOT NULL,
	"waID" varchar(64),
	"content" json,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"chatID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"userID" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(256) NOT NULL,
	"password" varchar(128) NOT NULL,
	"email" varchar(64) NOT NULL,
	"verified" boolean NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "user_password_unique" UNIQUE("password"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "waSession" (
	"waSessionID" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"createdBy" integer,
	"companyID" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_waSessionID_waSession_waSessionID_fk" FOREIGN KEY ("waSessionID") REFERENCES "waSession"("waSessionID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_clientID_client_clientID_fk" FOREIGN KEY ("clientID") REFERENCES "client"("clientID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_companyID_company_companyID_fk" FOREIGN KEY ("companyID") REFERENCES "company"("companyID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client" ADD CONSTRAINT "client_companyID_company_companyID_fk" FOREIGN KEY ("companyID") REFERENCES "company"("companyID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company" ADD CONSTRAINT "company_ownerID_user_userID_fk" FOREIGN KEY ("ownerID") REFERENCES "user"("userID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_chatID_chat_chatID_fk" FOREIGN KEY ("chatID") REFERENCES "chat"("chatID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "waSession" ADD CONSTRAINT "waSession_createdBy_user_userID_fk" FOREIGN KEY ("createdBy") REFERENCES "user"("userID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "waSession" ADD CONSTRAINT "waSession_companyID_company_companyID_fk" FOREIGN KEY ("companyID") REFERENCES "company"("companyID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
