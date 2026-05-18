export interface ConfidenceExplanation {
  source_level: string;
  cross_validation: string;
  evidence_support: string;
}

export interface DeepDive {
  underlying_logic: string;
  cross_boundary_links: string;
  exploration_directions: string[];
}

export interface IntelligenceItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  published_at: string;
  importance: number;
  confidence_score: number;
  confidence_explanation: ConfidenceExplanation;
  deep_dive?: DeepDive;
  sources?: { name: string; url: string }[];
}

export interface ChartData {
  id: string;
  title: string;
  path: string;
}

export interface DailyIntelligence {
  date: string;
  generated_at: string;
  executive_briefing: string;
  charts: ChartData[];
  intelligence_items: IntelligenceItem[];
}

export type CategoryType = 
  | 'IPO & Finance' 
  | 'AI & Tech' 
  | 'Policy' 
  | 'Finance' 
  | 'AI & Auto' 
  | 'Legal' 
  | 'AI & Social' 
  | 'AI & Hardware' 
  | 'AI & Web' 
  | 'Open Source';
