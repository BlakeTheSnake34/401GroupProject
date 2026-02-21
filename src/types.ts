export interface AppCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Session {
  app: string;
  purpose: string;
  duration: number;
  startedAt: Date;
}
