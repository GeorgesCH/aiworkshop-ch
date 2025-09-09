export type CourseModule = {
  id: string;         // e.g., 'learn-ai-overview'
  routeId: string;    // same as id for router
  title: string;
  estimatedMin?: number;
};

export const learnHubCourseKey = 'learn-hub';

// Guided path suggestions; user can still jump to any topic
export const learnCourseModules: CourseModule[] = [
  { id: 'learn-ai-overview', routeId: 'learn-ai-overview', title: 'AI Overview', estimatedMin: 8 },
  { id: 'learn-intelligence', routeId: 'learn-intelligence', title: 'What is Intelligence?', estimatedMin: 10 },
  { id: 'learn-machine-learning', routeId: 'learn-machine-learning', title: 'Machine Learning', estimatedMin: 20 },
  { id: 'learn-neural-networks', routeId: 'learn-neural-networks', title: 'Neural Networks', estimatedMin: 25 },
  { id: 'learn-deep-learning', routeId: 'learn-deep-learning', title: 'Deep Learning', estimatedMin: 15 },
  { id: 'learn-foundation-models', routeId: 'learn-foundation-models', title: 'Foundation Models', estimatedMin: 12 },
  { id: 'learn-generative-ai', routeId: 'learn-generative-ai', title: 'Generative AI', estimatedMin: 15 },
  { id: 'learn-llm-players', routeId: 'learn-llm-players', title: 'LLM Players', estimatedMin: 8 },
  { id: 'learn-ai-tools', routeId: 'learn-ai-tools', title: 'AI Tools', estimatedMin: 10 },
];

