// From blueprint:javascript_database and blueprint:javascript_log_in_with_replit
import {
  users,
  events,
  aiConversations,
  scenarioTemplates,
  type User,
  type UpsertUser,
  type Event,
  type InsertEvent,
  type UpdateEvent,
  type AiConversation,
  type InsertAiConversation,
  type ScenarioTemplate,
  type InsertScenarioTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Event operations
  getEvents(userId: string, startDate?: Date, endDate?: Date): Promise<Event[]>;
  getEvent(id: string, userId: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, userId: string, event: UpdateEvent): Promise<Event | undefined>;
  deleteEvent(id: string, userId: string): Promise<boolean>;
  deleteAllEvents(userId: string): Promise<void>;
  
  // AI Conversation operations
  getConversations(userId: string, limit?: number): Promise<AiConversation[]>;
  createConversation(conversation: InsertAiConversation): Promise<AiConversation>;
  deleteConversations(userId: string): Promise<void>;
  
  // Scenario Template operations
  getTemplates(): Promise<ScenarioTemplate[]>;
  createTemplate(template: InsertScenarioTemplate): Promise<ScenarioTemplate>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Event operations
  async getEvents(userId: string, startDate?: Date, endDate?: Date): Promise<Event[]> {
    const conditions = [eq(events.userId, userId)];
    
    if (startDate) {
      conditions.push(gte(events.endTime, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(events.startTime, endDate));
    }
    
    return await db
      .select()
      .from(events)
      .where(and(...conditions));
  }

  async getEvent(id: string, userId: string): Promise<Event | undefined> {
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.id, id), eq(events.userId, userId)));
    return event;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(eventData)
      .returning();
    return event;
  }

  async updateEvent(id: string, userId: string, eventData: UpdateEvent): Promise<Event | undefined> {
    const [event] = await db
      .update(events)
      .set({ ...eventData, updatedAt: new Date() })
      .where(and(eq(events.id, id), eq(events.userId, userId)))
      .returning();
    return event;
  }

  async deleteEvent(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(events)
      .where(and(eq(events.id, id), eq(events.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async deleteAllEvents(userId: string): Promise<void> {
    await db.delete(events).where(eq(events.userId, userId));
  }

  // AI Conversation operations
  async getConversations(userId: string, limit: number = 50): Promise<AiConversation[]> {
    return await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(aiConversations.createdAt)
      .limit(limit);
  }

  async createConversation(conversationData: InsertAiConversation): Promise<AiConversation> {
    const [conversation] = await db
      .insert(aiConversations)
      .values(conversationData)
      .returning();
    return conversation;
  }

  async deleteConversations(userId: string): Promise<void> {
    await db.delete(aiConversations).where(eq(aiConversations.userId, userId));
  }

  // Scenario Template operations
  async getTemplates(): Promise<ScenarioTemplate[]> {
    return await db
      .select()
      .from(scenarioTemplates)
      .where(eq(scenarioTemplates.isDefault, true));
  }

  async createTemplate(templateData: InsertScenarioTemplate): Promise<ScenarioTemplate> {
    const [template] = await db
      .insert(scenarioTemplates)
      .values(templateData)
      .returning();
    return template;
  }
}

export const storage = new DatabaseStorage();
