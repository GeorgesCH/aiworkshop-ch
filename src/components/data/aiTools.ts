export interface AITool {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
  featured: boolean;
  tags: string[];
  useCases: string[];
}

export const aiTools: AITool[] = [
  {
    id: 1,
    name: "Google Teachable Machine",
    category: "education",
    description: "No-code machine learning platform for creating models with your own data",
    url: "https://teachablemachine.withgoogle.com/train",
    featured: true,
    tags: ["Machine Learning", "No-Code", "Education"],
    useCases: ["Supervised Learning", "Image Classification", "Audio Recognition"]
  },
  {
    id: 2,
    name: "n8n",
    category: "automation",
    description: "Fair-code automation platform that lets you connect anything to everything",
    url: "https://n8n.io",
    featured: true,
    tags: ["Automation", "Workflows", "Integration"],
    useCases: ["Business Process Automation", "API Integration", "Data Synchronization"]
  },
  {
    id: 3,
    name: "AutoGen Studio",
    category: "llm",
    description: "Microsoft's multi-agent conversation framework for building AI agents",
    url: "https://microsoft.github.io/autogen/",
    featured: true,
    tags: ["Multi-Agent", "Conversations", "Microsoft"],
    useCases: ["Agent Collaboration", "Complex Problem Solving", "Automated Workflows"]
  },
  {
    id: 4,
    name: "Hugging Face",
    category: "llm",
    description: "The AI community platform with models, datasets, and applications",
    url: "https://huggingface.co",
    featured: true,
    tags: ["Models", "Community", "Open Source"],
    useCases: ["Model Hosting", "Fine-tuning", "Dataset Management"]
  },
  {
    id: 5,
    name: "LM Studio",
    category: "llm",
    description: "Run large language models locally on your machine",
    url: "https://lmstudio.ai",
    featured: false,
    tags: ["Local LLM", "Privacy", "Offline"],
    useCases: ["Private AI", "Local Development", "Data Security"]
  },
  {
    id: 6,
    name: "Cursor IDE",
    category: "code",
    description: "AI-powered code editor built for productivity",
    url: "https://cursor.sh",
    featured: true,
    tags: ["IDE", "Code Assistant", "Development"],
    useCases: ["Code Generation", "Debugging", "Refactoring"]
  },
  {
    id: 7,
    name: "Model Context Protocol (MCP)",
    category: "automation",
    description: "Standard for connecting AI assistants to data sources and tools",
    url: "https://modelcontextprotocol.io",
    featured: true,
    tags: ["Protocol", "Integration", "Standards"],
    useCases: ["Tool Integration", "Data Connection", "AI Agent Architecture"]
  },
  {
    id: 8,
    name: "ChatGPT",
    category: "llm",
    description: "OpenAI's conversational AI assistant for various tasks",
    url: "https://chat.openai.com",
    featured: true,
    tags: ["OpenAI", "Conversational AI", "GPT"],
    useCases: ["Content Creation", "Problem Solving", "Code Assistance"]
  },
  {
    id: 9,
    name: "Claude",
    category: "llm",
    description: "Anthropic's AI assistant focused on safety and helpfulness",
    url: "https://claude.ai",
    featured: true,
    tags: ["Anthropic", "Safety", "Constitutional AI"],
    useCases: ["Analysis", "Writing", "Research"]
  },
  {
    id: 10,
    name: "Gemini",
    category: "llm",
    description: "Google's multimodal AI model for text, images, and code",
    url: "https://gemini.google.com",
    featured: true,
    tags: ["Google", "Multimodal", "Integration"],
    useCases: ["Multimodal Tasks", "Google Workspace", "Search Enhancement"]
  },
  {
    id: 11,
    name: "Midjourney",
    category: "image",
    description: "AI image generation through Discord bot interface",
    url: "https://midjourney.com",
    featured: true,
    tags: ["Image Generation", "Art", "Creative"],
    useCases: ["Digital Art", "Concept Design", "Marketing Visuals"]
  },
  {
    id: 12,
    name: "DALL-E",
    category: "image",
    description: "OpenAI's image generation model from text descriptions",
    url: "https://openai.com/dall-e-3",
    featured: true,
    tags: ["OpenAI", "Image Generation", "Text-to-Image"],
    useCases: ["Creative Design", "Illustrations", "Marketing Materials"]
  },
  {
    id: 13,
    name: "Adobe Firefly",
    category: "image",
    description: "Adobe's creative generative AI integrated into Creative Cloud",
    url: "https://firefly.adobe.com",
    featured: false,
    tags: ["Adobe", "Creative Cloud", "Commercial Safe"],
    useCases: ["Professional Design", "Content Creation", "Brand Assets"]
  },
  {
    id: 14,
    name: "Runway",
    category: "creative",
    description: "AI video generation and editing platform",
    url: "https://runway.com",
    featured: false,
    tags: ["Video", "Editing", "Generation"],
    useCases: ["Video Creation", "Content Production", "Creative Workflows"]
  },
  {
    id: 15,
    name: "ElevenLabs",
    category: "creative",
    description: "AI voice synthesis and cloning platform",
    url: "https://elevenlabs.io",
    featured: false,
    tags: ["Voice", "Audio", "Synthesis"],
    useCases: ["Voice Over", "Podcasting", "Audio Content"]
  }
];