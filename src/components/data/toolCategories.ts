import { 
  Globe,
  MessageSquare,
  Image,
  Code,
  Zap,
  BarChart3,
  Music,
  Brain
} from "lucide-react";

export const toolCategories = [
  { id: "all", name: "All Tools", icon: Globe },
  { id: "llm", name: "Language Models", icon: MessageSquare },
  { id: "image", name: "Image Generation", icon: Image },
  { id: "code", name: "Code & Development", icon: Code },
  { id: "automation", name: "Automation", icon: Zap },
  { id: "analytics", name: "Analytics & BI", icon: BarChart3 },
  { id: "creative", name: "Creative", icon: Music },
  { id: "education", name: "Education", icon: Brain }
];