// From blueprint:javascript_log_in_with_replit and custom implementation
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertEventSchema, updateEventSchema } from "@shared/schema";
import { generateScheduleFromPrompt, applyScenarioTemplate } from "./aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Event routes
  app.get('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      
      const events = await storage.getEvents(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventData = insertEventSchema.parse({ ...req.body, userId });
      
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error: any) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: error.message || "Failed to create event" });
    }
  });

  app.patch('/api/events/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const eventData = updateEventSchema.parse(req.body);
      
      const event = await storage.updateEvent(id, userId, eventData);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error: any) {
      console.error("Error updating event:", error);
      res.status(400).json({ message: error.message || "Failed to update event" });
    }
  });

  app.delete('/api/events/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const deleted = await storage.deleteEvent(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // AI Conversation routes
  app.get('/api/ai/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // AI Generation route
  app.post('/api/ai/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const result = await generateScheduleFromPrompt(userId, prompt);

      // Delete existing events for clean slate (optional - could be configurable)
      await storage.deleteAllEvents(userId);

      // Create new events with validation
      for (const event of result.events) {
        const eventData = insertEventSchema.parse({
          userId,
          title: event.title,
          description: event.description,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
          color: event.color || 'chart-1',
          isAllDay: false,
        });
        await storage.createEvent(eventData);
      }

      res.json({ success: true, reply: result.reply });
    } catch (error: any) {
      console.error("Error generating schedule:", error);
      res.status(500).json({ message: error.message || "Failed to generate schedule" });
    }
  });

  // Apply scenario template route
  app.post('/api/ai/apply-template', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { templateId } = req.body;

      if (!templateId) {
        return res.status(400).json({ message: "Template ID is required" });
      }

      const result = await applyScenarioTemplate(userId, templateId);

      // Delete existing events
      await storage.deleteAllEvents(userId);

      // Create new events from template with validation
      for (const event of result.events) {
        const eventData = insertEventSchema.parse({
          userId,
          title: event.title,
          description: event.description,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
          color: event.color || 'chart-1',
          isAllDay: false,
        });
        await storage.createEvent(eventData);
      }

      res.json({ success: true, reply: result.reply });
    } catch (error: any) {
      console.error("Error applying template:", error);
      res.status(500).json({ message: error.message || "Failed to apply template" });
    }
  });

  // Scenario templates route
  app.get('/api/templates', async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
