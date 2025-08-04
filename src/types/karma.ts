export interface KarmaGAPProject {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  website?: string;
  twitter?: string;
  github?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  targetDate: Date;
  completedDate?: Date;
  attestationId?: string;
  verificationSource?: string;
  tags: string[];
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  publishedDate: Date;
  type: 'milestone' | 'progress' | 'announcement' | 'funding';
  attachments?: {
    url: string;
    type: 'image' | 'document' | 'link';
    title: string;
  }[];
  visibility: 'public' | 'supporters' | 'private';
}

export interface ImpactMetric {
  id: string;
  projectId: string;
  metric: string;
  value: number;
  unit: string;
  verificationSource: string;
  lastUpdated: Date;
  description?: string;
  category: 'environmental' | 'social' | 'economic' | 'governance';
}

export interface ProjectWithGAPData {
  // Existing Breadchain project data
  projectId: string;
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  
  // Karma GAP integration
  karmaGAPId?: string;
  karmaGAPProfile?: {
    project: KarmaGAPProject;
    milestones: Milestone[];
    recentUpdates: ProjectUpdate[];
    impactMetrics: ImpactMetric[];
    stats: {
      completionRate: number;
      trustScore: number;
      activityScore: number;
      lastUpdateDate: Date;
      totalMilestones: number;
      completedMilestones: number;
      totalUpdates: number;
    };
  };
}

export interface KarmaGAPApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 