import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Sparkles, Mic, Zap, Brain, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI Schedule Generation",
      description: "Create full calendars from natural language prompts",
    },
    {
      icon: Sparkles,
      title: "Smart Editing",
      description: "Conversational updates like 'Move gym to mornings'",
    },
    {
      icon: Mic,
      title: "Voice Input",
      description: "Hands-free event creation and calendar commands",
    },
    {
      icon: Zap,
      title: "Scenario Templates",
      description: "Quick-start with Focus Week, Wellness Week, or Exam Prep",
    },
    {
      icon: Clock,
      title: "Context Awareness",
      description: "AI learns your habits and optimizes future plans",
    },
    {
      icon: Calendar,
      title: "Smart Suggestions",
      description: "Balance time, add breaks, and adjust schedules",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">AI Calendar</span>
          </div>
          <a href="/api/login">
            <Button data-testid="button-login" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Get Started
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Scheduling
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Your Calendar,
            <br />
            Intelligently Managed
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Plan your week with natural language. Say "Schedule 2 gym sessions and 3 study blocks" 
            and watch AI create a perfectly balanced calendar.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/api/login">
              <Button size="lg" className="gap-2 text-base" data-testid="button-hero-start">
                <Sparkles className="w-5 h-5" />
                Start Planning
              </Button>
            </a>
            <Button size="lg" variant="outline" className="gap-2 text-base" data-testid="button-learn-more">
              <Brain className="w-5 h-5" />
              How It Works
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Demo Preview */}
      <section className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-1 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <div className="bg-card rounded-lg overflow-hidden border border-border/50">
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-background flex items-center justify-center">
                <div className="text-center p-8">
                  <Calendar className="w-20 h-20 mx-auto mb-4 text-primary/40" />
                  <p className="text-muted-foreground text-sm">Beautiful Apple-inspired calendar preview</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage your time smarter, not harder
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 hover-elevate h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Scheduling?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who plan smarter with AI-powered calendar management
          </p>
          <a href="/api/login">
            <Button size="lg" className="gap-2 text-base" data-testid="button-cta-start">
              <Sparkles className="w-5 h-5" />
              Get Started Free
            </Button>
          </a>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 AI Calendar. Intelligent scheduling for everyone.</p>
        </div>
      </footer>
    </div>
  );
}
