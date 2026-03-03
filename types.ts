export type AppView = 'splash' | 'loading' | '2d' | '3d' | 'resume' | 'projects' | 'case-study';

export interface PortfolioContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Operations' | 'Design' | 'AI' | 'Leadership';
  description: string;
  tags: string[];
  date: string;
  link?: string;
  github?: string;
  image?: string;
  imagePosition?: string;
}

export type SplineObjectId = 
  | 'c68e2fe7-80a1-4fd0-a1f2-5e058ad6ef74' // Macbook
  | 'a62f5de6-1324-4edf-813a-58e7e0a602f2' // Monitors
  | '604c4f41-f2eb-416f-a43a-ad5ae143d2e2' // Books
  | 'c6919b4f-4a09-456a-8f9f-d1004b8094ea' // Fountain
  | '1ee647e1-3ee5-42f9-80bd-4829e0df1c52' // Guitar
  | '1dfa5782-8ffc-47dc-9562-db86cba5ee72'; // Sesame

export interface AppShellContext {
  setSelectedContent: (content: PortfolioContent | null) => void;
  openAbout: () => void;
}