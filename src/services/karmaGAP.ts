import { karmaGAPConfig } from '../config/karma';
import { getRecentActivities } from '../utils/karmaGAPProcessing';
import type { 
  KarmaGAPProject, 
  Milestone, 
  ProjectUpdate, 
  ImpactMetric, 
  KarmaGAPApiResponse,
  ProjectWithGAPData 
} from '../types/karma';

export class KarmaGAPService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = karmaGAPConfig.apiBaseURL;
    this.apiKey = karmaGAPConfig.apiKey || '';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<KarmaGAPApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Karma GAP API Error:', error);
      throw error;
    }
  }

  async getProject(projectId: string): Promise<KarmaGAPProject | null> {
    try {
      const response = await this.request<KarmaGAPProject>(`/projects/${projectId}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error(`Failed to fetch project ${projectId}:`, error);
      return null;
    }
  }

  async getProjectMilestones(projectId: string): Promise<Milestone[]> {
    try {
      const response = await this.request<Milestone[]>(`/projects/${projectId}/milestones`);
      return response.success ? response.data : [];
    } catch (error) {
      console.error(`Failed to fetch milestones for project ${projectId}:`, error);
      return [];
    }
  }

  async getProjectUpdates(projectId: string, limit = 10): Promise<ProjectUpdate[]> {
    try {
      const response = await this.request<ProjectUpdate[]>(
        `/projects/${projectId}/updates?limit=${limit}&sort=desc`
      );
      return response.success ? response.data : [];
    } catch (error) {
      console.error(`Failed to fetch updates for project ${projectId}:`, error);
      return [];
    }
  }

  async getProjectImpactMetrics(projectId: string): Promise<ImpactMetric[]> {
    try {
      const response = await this.request<ImpactMetric[]>(`/projects/${projectId}/impact`);
      return response.success ? response.data : [];
    } catch (error) {
      console.error(`Failed to fetch impact metrics for project ${projectId}:`, error);
      return [];
    }
  }

  async getCompleteProjectData(karmaGAPId: string): Promise<ProjectWithGAPData['karmaGAPProfile'] | null> {
    console.log(`KarmaGAPService: getCompleteProjectData called for ${karmaGAPId}`);
    
    try {
      // For now, return mock data since we don't have real API access
      const mockData = this.getMockProjectData(karmaGAPId);
      console.log(`KarmaGAPService: Mock data generated for ${karmaGAPId}:`, {
        hasData: !!mockData,
        stats: mockData?.stats,
        recentUpdates: mockData?.recentUpdates?.length || 0
      });
      return mockData;
    } catch (error) {
      console.error(`Failed to fetch complete project data for ${karmaGAPId}:`, error);
      return null;
    }
  }

  private getMockProjectData(karmaGAPId: string): ProjectWithGAPData['karmaGAPProfile'] {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    console.log(`KarmaGAPService: Current date: ${now.toISOString()}`);
    console.log(`KarmaGAPService: Last month date: ${lastMonth.toISOString()}`);
    
    const projectConfigs: { [key: string]: { name: string; description: string; focus: string } } = {
      'sample-labor-dao-id': { 
        name: 'Labour DAO', 
        description: 'A DAO supporting workers who want to organize in web3 and out.',
        focus: 'worker organization and community building'
      },
      'sample-breadchain-core-id': { 
        name: 'Breadchain Core', 
        description: 'The core team developing the tech and design used by Breadchain.',
        focus: 'technology development and infrastructure'
      },
      'sample-symbiota-id': { 
        name: 'Symbiota', 
        description: 'Event-focused organization building community through gatherings.',
        focus: 'cultural events and community building'
      },
      'sample-research-collective-id': { 
        name: 'Research Collective', 
        description: 'Research group studying decentralized technology and governance.',
        focus: 'research and academic studies'
      },
      'sample-default': { 
        name: 'Default Project', 
        description: 'A default project configuration.',
        focus: 'general development and community building'
      }
    };

    const config = projectConfigs[karmaGAPId] || projectConfigs['sample-default'];
    console.log(`KarmaGAPService: Using config for ${karmaGAPId}:`, config);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

    // Generate diverse milestones based on project focus
    const milestones = this.generateProjectMilestones(karmaGAPId, config.focus);
    
    // Generate all updates (not filtered by date initially)
    const allUpdates = this.generateProjectUpdates(karmaGAPId, config.focus, now, lastMonth);
    
    console.log(`KarmaGAPService: Generated ${allUpdates.length} updates for ${karmaGAPId}`);
    allUpdates.forEach((update, index) => {
      console.log(`KarmaGAPService: Update ${index + 1} date: ${update.publishedDate.toISOString()}`);
    });
    
    // Always use all updates to ensure Karma GAP insights show for all projects
    const recentUpdates = allUpdates;
    console.log(`KarmaGAPService: Using all ${allUpdates.length} updates for ${karmaGAPId}`);

    return {
      project: {
        id: karmaGAPId,
        title: config.name,
        description: config.description,
        status: "active",
        createdAt: new Date("2024-01-01"),
        updatedAt: lastWeek,
        website: "https://breadchain.xyz",
        github: "https://github.com/breadchain",
      },
      milestones,
      recentUpdates,
      impactMetrics: this.generateImpactMetrics(karmaGAPId, config.focus),
      stats: {
        completionRate: this.calculateCompletionRate(milestones),
        trustScore: this.calculateTrustScore(milestones, recentUpdates),
        activityScore: this.calculateActivityScore(recentUpdates),
        lastUpdateDate: recentUpdates.length > 0 ? new Date(recentUpdates[0].publishedDate) : lastWeek,
        totalMilestones: milestones.length,
        completedMilestones: milestones.filter(m => m.status === 'completed').length,
        totalUpdates: recentUpdates.length,
      },
    };
  }

  private generateProjectMilestones(projectId: string, focus: string): Milestone[] {
    const baseMilestones: Milestone[] = [
      {
        id: `${projectId}-milestone-1`,
        projectId: projectId,
        title: "Initial Development Phase",
        description: "Complete initial development and setup",
        status: "completed",
        targetDate: new Date("2024-03-01"),
        completedDate: new Date("2024-02-28"),
        tags: ["development"],
      },
      {
        id: `${projectId}-milestone-2`,
        projectId: projectId,
        title: "Community Beta Testing",
        description: "Launch beta version for community testing",
        status: "completed",
        targetDate: new Date("2024-06-01"),
        completedDate: new Date("2024-05-30"),
        tags: ["beta", "community"],
      },
      {
        id: `${projectId}-milestone-3`,
        projectId: projectId,
        title: "Production Deployment",
        description: "Deploy to production environment",
        status: "in_progress",
        targetDate: new Date("2024-12-31"),
        tags: ["production"],
      },
    ];

         // Add focus-specific milestones
           if (focus.includes('worker')) {
        baseMilestones.push({
          id: `${projectId}-milestone-4`,
          projectId: projectId,
          title: "Worker Organization Campaign",
          description: "Launch worker organization and advocacy campaign",
          status: "pending",
          targetDate: new Date("2025-02-01"),
          tags: ["advocacy", "organization"],
        });
           } else if (focus.includes('cultural')) {
        baseMilestones.push({
          id: `${projectId}-milestone-4`,
          projectId: projectId,
          title: "Cultural Event Series",
          description: "Organize and host cultural event series",
          status: "pending",
          targetDate: new Date("2025-02-01"),
          tags: ["events", "culture"],
        });
           } else if (focus.includes('research')) {
        baseMilestones.push({
          id: `${projectId}-milestone-4`,
          projectId: projectId,
          title: "Research Publication",
          description: "Publish research findings on decentralized tech",
          status: "pending",
          targetDate: new Date("2025-02-01"),
          tags: ["research", "publication"],
        });
     }

    return baseMilestones;
  }

  private generateProjectUpdates(projectId: string, focus: string, now: Date, lastMonth: Date): ProjectUpdate[] {
    const updates = [
      {
        id: `${projectId}-update-1`,
        projectId: projectId,
        title: "Weekly Progress Update",
        content: `Great progress this week on ${focus}. We've made significant strides towards our production deployment milestone.`,
        publishedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        type: "progress" as const,
        visibility: "public" as const,
      },
      {
        id: `${projectId}-update-2`,
        projectId: projectId,
        title: "Milestone Completed",
        content: "Successfully completed our community beta testing phase with excellent feedback from the community.",
        publishedDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        type: "milestone" as const,
        visibility: "public" as const,
      },
      {
        id: `${projectId}-update-3`,
        projectId: projectId,
        title: "Community Engagement",
        content: `Engaged with our community on ${focus} initiatives. Received valuable feedback and suggestions.`,
        publishedDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        type: "progress" as const,
        visibility: "public" as const,
      },
      {
        id: `${projectId}-update-4`,
        projectId: projectId,
        title: "Technical Improvements",
        content: "Implemented several technical improvements based on community feedback and testing results.",
        publishedDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        type: "progress" as const,
        visibility: "public" as const,
      },
      {
        id: `${projectId}-update-5`,
        projectId: projectId,
        title: "Partnership Announcement",
        content: "Announced new partnerships that will help us achieve our goals in the coming months.",
        publishedDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        type: "milestone" as const,
        visibility: "public" as const,
      },
    ];

    return updates;
  }

  private generateImpactMetrics(projectId: string, focus: string): ImpactMetric[] {
    const baseMetrics = [
      {
        id: `${projectId}-metric-1`,
        projectId: projectId,
        metric: "Community Members",
        value: Math.floor(Math.random() * 200) + 50, // 50-250
        unit: "members",
        verificationSource: "Discord Analytics",
        lastUpdated: new Date(),
        category: "social" as const,
      },
      {
        id: `${projectId}-metric-2`,
        projectId: projectId,
        metric: "GitHub Commits",
        value: Math.floor(Math.random() * 500) + 100, // 100-600
        unit: "commits",
        verificationSource: "GitHub API",
        lastUpdated: new Date(),
        category: "governance" as const,
      },
    ];

    // Add focus-specific metrics
    if (focus.includes('worker')) {
      baseMetrics.push({
        id: `${projectId}-metric-3`,
        projectId: projectId,
        metric: "Workers Organized",
        value: Math.floor(Math.random() * 100) + 20,
        unit: "workers",
        verificationSource: "Community Reports",
        lastUpdated: new Date(),
        category: "social" as const,
      });
    } else if (focus.includes('cultural')) {
      baseMetrics.push({
        id: `${projectId}-metric-3`,
        projectId: projectId,
        metric: "Events Hosted",
        value: Math.floor(Math.random() * 20) + 5,
        unit: "events",
        verificationSource: "Event Records",
        lastUpdated: new Date(),
        category: "social" as const,
      });
    } else if (focus.includes('research')) {
      baseMetrics.push({
        id: `${projectId}-metric-3`,
        projectId: projectId,
        metric: "Research Papers",
        value: Math.floor(Math.random() * 10) + 2,
        unit: "papers",
        verificationSource: "Academic Database",
        lastUpdated: new Date(),
        category: "governance" as const,
      });
    }

    return baseMetrics;
  }

  private calculateCompletionRate(milestones: Milestone[]): number {
    const completed = milestones.filter(m => m.status === 'completed').length;
    return milestones.length > 0 ? (completed / milestones.length) * 100 : 0;
  }

  private calculateTrustScore(milestones: Milestone[], updates: ProjectUpdate[]): number {
    const completionRate = this.calculateCompletionRate(milestones);
    const updateScore = Math.min(updates.length * 5, 30); // Up to 30 points for updates
    const activityScore = Math.max(0, 100 - (updates.length === 0 ? 50 : 0)); // Penalty for no updates
    
    return Math.min(100, (completionRate * 0.4) + (activityScore * 0.3) + updateScore);
  }

  private calculateActivityScore(updates: ProjectUpdate[]): number {
    if (updates.length === 0) return 0;
    
    const now = new Date();
    const lastUpdate = new Date(updates[0].publishedDate);
    const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, 100 - (daysSinceUpdate * 2)); // Decrease by 2 points per day
  }
}

// Create singleton instance
export const karmaGAPService = new KarmaGAPService(); 