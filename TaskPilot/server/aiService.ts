// From blueprint:javascript_openai
import OpenAI from "openai";
import { storage } from "./storage";
import { InsertEvent } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GeneratedEvent {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface AIResponse {
  events: GeneratedEvent[];
  reply: string;
}

export async function generateScheduleFromPrompt(
  userId: string,
  prompt: string
): Promise<AIResponse> {
  // Get conversation history for context
  const conversations = await storage.getConversations(userId, 10);
  
  const messages: any[] = [
    {
      role: "system",
      content: `You are an intelligent calendar assistant. Generate calendar events based on user prompts. 
      
Rules:
1. Always respond with JSON in this exact format: { "events": [...], "reply": "..." }
2. Each event must have: title, startTime (ISO 8601), endTime (ISO 8601), and color (chart-1 to chart-5)
3. Use smart defaults for timing - morning (9 AM), afternoon (2 PM), evening (6 PM)
4. Spread events throughout the week intelligently
5. Add helpful descriptions when relevant
6. Color code by category: chart-1 (blue) for work/study, chart-2 (green) for health/gym, chart-3 (red) for important, chart-4 (orange) for social, chart-5 (purple) for personal
7. Keep events realistic (30min - 3 hours typically)
8. Reply should be friendly and confirm what you created

Current date: ${new Date().toISOString()}`,
    },
  ];

  // Add conversation history
  for (const conv of conversations) {
    messages.push({
      role: conv.role as "user" | "assistant",
      content: conv.content,
    });
  }

  // Add current prompt
  messages.push({
    role: "user",
    content: prompt,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages,
    response_format: { type: "json_object" },
    max_completion_tokens: 2048,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  // Save user prompt to conversation
  await storage.createConversation({
    userId,
    role: "user",
    content: prompt,
  });

  // Save AI reply to conversation
  await storage.createConversation({
    userId,
    role: "assistant",
    content: result.reply || "I've created your events!",
  });

  return {
    events: result.events || [],
    reply: result.reply || "I've created your events!",
  };
}

export async function applyScenarioTemplate(
  userId: string,
  templateId: string
): Promise<AIResponse> {
  const templates = await storage.getTemplates();
  const template = templates.find(t => t.id === templateId);
  
  if (!template) {
    throw new Error("Template not found");
  }

  // Use the template prompt to generate events
  return await generateScheduleFromPrompt(userId, template.prompt);
}

export async function modifySchedule(
  userId: string,
  modification: string,
  currentEvents: InsertEvent[]
): Promise<AIResponse> {
  const messages = [
    {
      role: "system",
      content: `You are an intelligent calendar assistant. Modify existing calendar events based on user requests.
      
Current events: ${JSON.stringify(currentEvents, null, 2)}

Rules:
1. Respond with JSON: { "events": [...], "reply": "..." }
2. Include ALL events (modified and unchanged)
3. Apply the user's requested changes
4. Keep the reply friendly and explain what changed
5. Maintain event colors and IDs where possible`,
    },
    {
      role: "user",
      content: modification,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages,
    response_format: { type: "json_object" },
    max_completion_tokens: 2048,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");

  // Save to conversation
  await storage.createConversation({
    userId,
    role: "user",
    content: modification,
  });

  await storage.createConversation({
    userId,
    role: "assistant",
    content: result.reply || "I've updated your schedule!",
  });

  return {
    events: result.events || [],
    reply: result.reply || "I've updated your schedule!",
  };
}
