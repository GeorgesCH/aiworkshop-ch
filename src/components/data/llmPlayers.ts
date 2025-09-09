export interface LLMPlayer {
  name: string;
  country: string;
  founder: string;
  flagshipModel: string;
  ethicsResponsibility: string;
  description: string;
  website: string;
  youtube?: string;
  models: string[];
  color: string;
}

export const llmPlayers: LLMPlayer[] = [
  {
    name: "OpenAI",
    country: "🇺🇸 USA",
    founder: "Sam Altman, Greg Brockman",
    flagshipModel: "GPT-4 / GPT-4o",
    ethicsResponsibility: "RLHF, capped-profit, transparency",
    description: "Pioneer in large language models with GPT series and ChatGPT",
    website: "https://openai.com/",
    models: ["GPT-4", "ChatGPT", "DALL-E", "Whisper"],
    color: "bg-green-500/10 text-green-600 border-green-200"
  },
  {
    name: "Anthropic",
    country: "🇺🇸 USA", 
    founder: "Dario & Daniela Amodei",
    flagshipModel: "Claude 3",
    ethicsResponsibility: "Constitutional AI, long-context safety",
    description: "Focused on AI safety with Claude models and constitutional AI",
    website: "https://www.anthropic.com/",
    youtube: "https://www.youtube.com/@anthropic-ai",
    models: ["Claude 3", "Claude 2", "Constitutional AI"],
    color: "bg-blue-500/10 text-blue-600 border-blue-200"
  },
  {
    name: "DeepMind",
    country: "🇬🇧/🇺🇸",
    founder: "Demis Hassabis et al.",
    flagshipModel: "Gemini 1.5",
    ethicsResponsibility: "Academic, strong on safety and research",
    description: "Google's AI research lab known for Gemini and breakthrough research",
    website: "https://deepmind.google/",
    models: ["Gemini", "AlphaFold", "PaLM"],
    color: "bg-purple-500/10 text-purple-600 border-purple-200"
  },
  {
    name: "Meta",
    country: "🇺🇸 USA",
    founder: "Mark Zuckerberg",
    flagshipModel: "LLaMA 3",
    ethicsResponsibility: "Open-source, less alignment focus",
    description: "Open-source approach with LLaMA models for research and development",
    website: "https://ai.meta.com/",
    models: ["LLaMA 3", "Code Llama", "SeamlessM4T"],
    color: "bg-orange-500/10 text-orange-600 border-orange-200"
  },
  {
    name: "xAI",
    country: "🇺🇸 USA",
    founder: "Elon Musk",
    flagshipModel: "Grok",
    ethicsResponsibility: "Minimal filtering, free-speech focus",
    description: "Elon Musk's AI company focused on understanding reality with Grok",
    website: "https://grok.com/",
    models: ["Grok", "Grok-1.5"],
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-200"
  },
  {
    name: "Mistral",
    country: "🇫🇷 France",
    founder: "Arthur Mensch, et al.",
    flagshipModel: "Mistral Large",
    ethicsResponsibility: "Transparent, developer-focused",
    description: "European AI company creating efficient and accessible language models",
    website: "https://mistral.ai/",
    models: ["Mistral 7B", "Mixtral 8x7B", "Mistral Large"],
    color: "bg-pink-500/10 text-pink-600 border-pink-200"
  },
  {
    name: "Cohere",
    country: "🇨🇦 Canada",
    founder: "Aidan Gomez",
    flagshipModel: "Command R+",
    ethicsResponsibility: "Retrieval-focused, privacy-aware",
    description: "Enterprise-focused AI with natural language understanding and generation",
    website: "https://cohere.com/",
    models: ["Command", "Embed", "Rerank"],
    color: "bg-teal-500/10 text-teal-600 border-teal-200"
  },
  {
    name: "Aleph Alpha",
    country: "🇩🇪 Germany",
    founder: "Jonas Andrulis",
    flagshipModel: "Luminous",
    ethicsResponsibility: "EU-compliant, explainability tools",
    description: "European AI sovereignty with multilingual models and explainable AI",
    website: "https://aleph-alpha.com/",
    models: ["Luminous", "Pharia"],
    color: "bg-red-500/10 text-red-600 border-red-200"
  },
  {
    name: "DeepSeek",
    country: "🇨🇳 China",
    founder: "DeepSeek-Vision Team, backed by Tsinghua & industry partners",
    flagshipModel: "DeepSeek-VL, DeepSeek-Coder",
    ethicsResponsibility: "Build open, high-performing multilingual & multimodal AI, research-oriented, strong in code & vision, focused on transparent benchmarking",
    description: "Advanced AI research with focus on reasoning and mathematical capabilities",
    website: "https://www.deepseek.com/",
    models: ["DeepSeek-V2", "DeepSeek-Math", "DeepSeek-Coder"],
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-200"
  }
];