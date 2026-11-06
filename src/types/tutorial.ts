export interface TutorialStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  route: string;
  targetSelector?: string;
  tip?: string;
  badge?: string;
}
