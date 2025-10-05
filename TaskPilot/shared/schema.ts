import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth (from blueprint:javascript_log_in_with_replit)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth (from blueprint:javascript_log_in_with_replit)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendar events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  color: varchar("color", { length: 50 }).notNull().default('chart-1'), // chart-1 through chart-5
  isAllDay: boolean("is_all_day").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI conversation history table
export const aiConversations = pgTable("ai_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar("role", { length: 20 }).notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Scenario templates table
export const scenarioTemplates = pgTable("scenario_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  prompt: text("prompt").notNull(), // The AI prompt to generate this scenario
  icon: varchar("icon", { length: 50 }).notNull().default('Calendar'),
  isDefault: boolean("is_default").default(true), // true for system templates, false for user-created
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  aiConversations: many(aiConversations),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}));

export const aiConversationsRelations = relations(aiConversations, ({ one }) => ({
  user: one(users, {
    fields: [aiConversations.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Event title is required"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).omit({
  id: true,
  createdAt: true,
});

export const insertScenarioTemplateSchema = createInsertSchema(scenarioTemplates).omit({
  id: true,
  createdAt: true,
});

export const updateEventSchema = insertEventSchema.partial().omit({
  userId: true,
});

// TypeScript types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;
export type AiConversation = typeof aiConversations.$inferSelect;

export type InsertScenarioTemplate = z.infer<typeof insertScenarioTemplateSchema>;
export type ScenarioTemplate = typeof scenarioTemplates.$inferSelect;
