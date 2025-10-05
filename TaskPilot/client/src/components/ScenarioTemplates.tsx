import { useQuery, useMutation } from "@tanstack/react-query";
import { ScenarioTemplate } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Zap, GraduationCap, Heart, Target, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function ScenarioTemplates() {
  const { toast } = useToast();
  
  const { data: templates = [], isLoading } = useQuery<ScenarioTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const mutation = useMutation({
    mutationFn: async (templateId: string) => {
      return await apiRequest("POST", "/api/ai/apply-template", { templateId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ai/conversations"] });
      toast({
        title: "Success",
        description: "Template applied to your calendar",
      });
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
        description: error.message || "Failed to apply template",
        variant: "destructive",
      });
    },
  });

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Zap,
      GraduationCap,
      Heart,
      Target,
    };
    const Icon = icons[iconName] || Zap;
    return <Icon className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {templates.map((template) => (
        <Card
          key={template.id}
          onClick={() => mutation.mutate(template.id)}
          className="p-3 hover-elevate cursor-pointer transition-all"
          data-testid={`template-${template.id}`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
              {getIcon(template.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm mb-1">{template.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {template.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
