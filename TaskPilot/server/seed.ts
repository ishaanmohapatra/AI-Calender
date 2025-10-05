import { db } from "./db";
import { scenarioTemplates } from "@shared/schema";

const defaultTemplates = [
  {
    name: "Focus Week",
    description: "Dedicated deep work sessions with breaks and minimal distractions",
    prompt: "Create a focused work week with 4-hour deep work blocks in the mornings (9 AM - 1 PM), 1-hour lunch breaks, 2-hour focused afternoon sessions (2 PM - 4 PM), and 30-minute breaks between each session. Include daily morning planning at 8:30 AM and end-of-day review at 5 PM. Schedule from Monday to Friday.",
    icon: "Zap",
    isDefault: true,
  },
  {
    name: "Wellness Week",
    description: "Balanced schedule with exercise, meditation, and self-care",
    prompt: "Create a wellness-focused week with daily morning meditation at 7 AM (20 minutes), workout sessions at 6:30 PM (1 hour) on Monday, Wednesday, Friday, yoga on Tuesday and Thursday at 6:30 PM (1 hour), healthy meal prep on Sunday at 10 AM (2 hours), and weekly spa/relaxation time on Saturday at 2 PM (2 hours). Include 8-hour sleep blocks from 10 PM to 6 AM daily.",
    icon: "Heart",
    isDefault: true,
  },
  {
    name: "Exam Prep",
    description: "Intensive study schedule with strategic breaks and review sessions",
    prompt: "Create an exam preparation week with 3 study blocks per day: morning session 9 AM - 11:30 AM, afternoon session 2 PM - 4:30 PM, and evening review 7 PM - 9 PM. Include 30-minute breaks between sessions, 1-hour lunch at 12 PM, and practice test on Saturday 10 AM - 2 PM. Add daily morning review of flashcards at 8:30 AM and evening recap at 9:30 PM. Sunday has lighter schedule with 2 study sessions and more breaks.",
    icon: "GraduationCap",
    isDefault: true,
  },
  {
    name: "Balanced Routine",
    description: "Well-rounded weekly schedule mixing work, fitness, and personal time",
    prompt: "Create a balanced weekly routine: Work blocks Monday-Friday 9 AM - 12 PM and 1 PM - 5 PM with 1-hour lunch break. Morning gym sessions Monday, Wednesday, Friday at 7 AM (1 hour). Hobby time Tuesday and Thursday evenings 7 PM - 9 PM. Family dinner Sunday at 6 PM (2 hours). Weekend morning coffee and reading Saturday 8 AM - 10 AM. Add meal planning Sunday 11 AM (1 hour).",
    icon: "Target",
    isDefault: true,
  },
];

async function seed() {
  console.log("Seeding default templates...");
  
  for (const template of defaultTemplates) {
    await db.insert(scenarioTemplates).values(template).onConflictDoNothing();
  }
  
  console.log("✓ Default templates seeded successfully");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding templates:", error);
  process.exit(1);
});
