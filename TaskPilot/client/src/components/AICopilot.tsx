import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Mic, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AiConversation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AICopilot() {
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: conversations = [], isLoading } = useQuery<AiConversation[]>({
    queryKey: ["/api/ai/conversations"],
  });

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/ai/generate", { prompt: content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setPrompt("");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to process your request",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversations]);

  const handleSubmit = () => {
    if (!prompt.trim() || mutation.isPending) return;
    mutation.mutate(prompt.trim());
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
    };
    
    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to capture voice input",
        variant: "destructive",
      });
    };
    
    recognition.start();
  };

  const suggestions = [
    "Plan my week with 2 gym sessions, 3 study blocks, and a movie night",
    "Move gym to mornings",
    "Add a 30-minute break after every study block",
    "Make Saturday fully free",
    "Schedule daily meditation at 7 AM",
  ];

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Copilot</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Tell me how you'd like to plan your week
        </p>
      </div>

      {/* Conversation Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground mb-4">
                Start a conversation to plan your schedule
              </p>
              <div className="space-y-2">
                {suggestions.slice(0, 3).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(suggestion)}
                    className="block w-full text-left text-xs p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    data-testid={`suggestion-${i}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {conversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${conv.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      conv.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                    data-testid={`message-${conv.role}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{conv.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {mutation.isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-2xl px-4 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Enter your request..."
            className="resize-none min-h-[60px] max-h-[120px]"
            disabled={mutation.isPending}
            data-testid="input-copilot-prompt"
          />
          <div className="flex flex-col gap-2">
            <Button
              size="icon"
              variant={isListening ? "default" : "outline"}
              onClick={handleVoiceInput}
              disabled={mutation.isPending}
              data-testid="button-voice-input"
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={!prompt.trim() || mutation.isPending}
              data-testid="button-send-prompt"
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
