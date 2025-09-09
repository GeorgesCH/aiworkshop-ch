import { 
  Brain, 
  Computer, 
  Zap, 
  Heart, 
  Users, 
  CheckCircle, 
  XCircle, 
  Target,
  Lightbulb,
  BarChart3,
  MessageSquare,
  Eye,
  Cpu
} from "lucide-react";

export const intelligenceComparison = [
  {
    aspectKey: "data_handling",
    humanKey: "data_handling_human",
    humanIcon: Brain,
    machineKey: "data_handling_machine", 
    machineIcon: BarChart3,
    augmentedKey: "data_handling_augmented",
    augmentedIcon: Target
  },
  {
    aspectKey: "repetition",
    humanKey: "repetition_human",
    humanIcon: Users,
    machineKey: "repetition_machine",
    machineIcon: Cpu,
    augmentedKey: "repetition_augmented",
    augmentedIcon: Eye
  },
  {
    aspectKey: "creativity", 
    humanKey: "creativity_human",
    humanIcon: Lightbulb,
    machineKey: "creativity_machine",
    machineIcon: Computer,
    augmentedKey: "creativity_augmented",
    augmentedIcon: Zap
  },
  {
    aspectKey: "emotional_insight",
    humanKey: "emotional_insight_human",
    humanIcon: Heart,
    machineKey: "emotional_insight_machine", 
    machineIcon: XCircle,
    augmentedKey: "emotional_insight_augmented",
    augmentedIcon: MessageSquare
  }
];

export const capabilityMatrix = [
  {
    categoryKey: "machine_interference",
    human: { status: "negative", icon: XCircle },
    artificial: { status: "positive", icon: CheckCircle },
    augmented: { status: "positive", icon: CheckCircle }
  },
  {
    categoryKey: "human_guidance", 
    human: { status: "negative", icon: XCircle },
    artificial: { status: "positive", icon: CheckCircle },
    augmented: { status: "positive", icon: CheckCircle }
  }
];

export const aiCapabilities = [
  { titleKey: "reasoning", icon: Brain, descriptionKey: "reasoning_desc" },
  { titleKey: "natural_communication", icon: MessageSquare, descriptionKey: "natural_communication_desc" },
  { titleKey: "problem_solving", icon: Target, descriptionKey: "problem_solving_desc" }
];

export const aiCharacteristics = [
  { titleKey: "replaces_human_effort", icon: Cpu, descriptionKey: "replaces_human_effort_desc" },
  { titleKey: "performs_independently", icon: Zap, descriptionKey: "performs_independently_desc" }
];

export const eqPrinciples = [
  { key: "wisdom_center" },
  { key: "guides_decisions" }, 
  { key: "no_words" },
  { key: "connected_emotions" },
  { key: "combine_eq_iq" }
];