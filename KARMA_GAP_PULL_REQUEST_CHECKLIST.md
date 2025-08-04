# Karma GAP Integration - Pull Request Implementation Checklist

**Epic**: Integrate Karma GAP with Breadchain Crowdstaking App  
**Repository**: [BreadchainCoop/crowdstaking-v2](https://github.com/BreadchainCoop/crowdstaking-v2)  
**Target Branch**: `main`  
**Feature Branch**: `feature/karma-gap-integration`

## 🚀 Quick Start Implementation Guide

### Prerequisites
- [ ] Review [Karma API Documentation](https://documenter.getpostman.com/view/36647319/2sAXxQdrkZ)
- [ ] Set up development environment following repository README
- [ ] Obtain Karma GAP API access credentials
- [ ] Review existing codebase structure

---

## 📋 Phase 1: Foundation Setup (PR #1)

### 🔧 Environment & Configuration

#### 1. Environment Variables
- [ ] **File**: `.env.example`
```bash
# Add to .env.example
NEXT_PUBLIC_KARMA_GAP_API_URL=https://api.karmahq.xyz/api
KARMA_GAP_API_KEY=your_api_key_here
KARMA_GAP_WEBHOOK_SECRET=your_webhook_secret_here
```

- [ ] **File**: `.env.local`
```bash
# Add to .env.local (copy from .env.example)
NEXT_PUBLIC_KARMA_GAP_API_URL=https://api.karmahq.xyz/api
KARMA_GAP_API_KEY=actual_api_key
KARMA_GAP_WEBHOOK_SECRET=actual_webhook_secret
```

#### 2. Configuration Files
- [ ] **File**: `src/config/karma.ts`
```typescript
export const karmaGAPConfig = {
  apiBaseURL: process.env.NEXT_PUBLIC_KARMA_GAP_API_URL || 'https://api.karmahq.xyz/api',
  apiKey: process.env.KARMA_GAP_API_KEY,
  webhookSecret: process.env.KARMA_GAP_WEBHOOK_SECRET,
  cacheExpiry: {
    milestones: 24 * 60 * 60 * 1000, // 24 hours
    updates: 6 * 60 * 60 * 1000,     // 6 hours
    impact: 24 * 60 * 60 * 1000,     // 24 hours
  },
  retryConfig: {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
  },
  endpoints: {
    projects: '/projects',
    milestones: '/projects/{projectId}/milestones',
    updates: '/projects/{projectId}/updates',
    impact: '/projects/{projectId}/impact',
    grants: '/projects/{projectId}/grants',
    attestations: '/projects/{projectId}/attestations',
  },
};
```

### 🗄️ Type Definitions

#### 3. TypeScript Interfaces
- [ ] **File**: `src/types/karma.ts`
```typescript
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
```

### 🔌 API Service Layer

#### 4. Karma GAP Service
- [ ] **File**: `src/services/karmaGAP.ts`
```typescript
import { karmaGAPConfig } from '../config/karma';
import type { 
  KarmaGAPProject, 
  Milestone, 
  ProjectUpdate, 
  ImpactMetric, 
  KarmaGAPApiResponse 
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
    try {
      const [project, milestones, updates, impactMetrics] = await Promise.all([
        this.getProject(karmaGAPId),
        this.getProjectMilestones(karmaGAPId),
        this.getProjectUpdates(karmaGAPId, 5),
        this.getProjectImpactMetrics(karmaGAPId),
      ]);

      if (!project) return null;

      // Calculate stats
      const completedMilestones = milestones.filter(m => m.status === 'completed').length;
      const completionRate = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;
      
      const lastUpdate = updates.length > 0 ? new Date(updates[0].publishedDate) : new Date(project.updatedAt);
      const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
      const activityScore = Math.max(0, 100 - (daysSinceUpdate * 2)); // Decrease by 2 points per day
      
      // Simple trust score calculation (can be enhanced)
      const trustScore = Math.min(100, 
        (completionRate * 0.4) + 
        (activityScore * 0.3) + 
        (Math.min(updates.length * 5, 30)) // Up to 30 points for updates
      );

      return {
        project,
        milestones,
        recentUpdates: updates,
        impactMetrics,
        stats: {
          completionRate,
          trustScore,
          activityScore,
          lastUpdateDate: lastUpdate,
          totalMilestones: milestones.length,
          completedMilestones,
          totalUpdates: updates.length,
        },
      };
    } catch (error) {
      console.error(`Failed to fetch complete project data for ${karmaGAPId}:`, error);
      return null;
    }
  }
}

// Create singleton instance
export const karmaGAPService = new KarmaGAPService();
```

### 🔄 Data Utilities

#### 5. Data Processing Utilities
- [ ] **File**: `src/utils/karmaGAPProcessing.ts`
```typescript
import type { ProjectWithGAPData, Milestone, ProjectUpdate } from '../types/karma';

export function calculateProjectHealth(profile: ProjectWithGAPData['karmaGAPProfile']): {
  health: 'excellent' | 'good' | 'fair' | 'poor';
  score: number;
  reasons: string[];
} {
  if (!profile) return { health: 'poor', score: 0, reasons: ['No Karma GAP data available'] };

  const { stats } = profile;
  const reasons: string[] = [];
  let score = 0;

  // Completion rate (40% weight)
  const completionWeight = stats.completionRate * 0.4;
  score += completionWeight;
  
  if (stats.completionRate >= 80) {
    reasons.push('High milestone completion rate');
  } else if (stats.completionRate < 50) {
    reasons.push('Low milestone completion rate');
  }

  // Activity score (30% weight)
  const activityWeight = stats.activityScore * 0.3;
  score += activityWeight;
  
  const daysSinceUpdate = Math.floor((Date.now() - stats.lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceUpdate <= 7) {
    reasons.push('Recently updated');
  } else if (daysSinceUpdate > 30) {
    reasons.push('Infrequent updates');
  }

  // Trust score (30% weight)
  const trustWeight = stats.trustScore * 0.3;
  score += trustWeight;

  // Determine health level
  let health: 'excellent' | 'good' | 'fair' | 'poor';
  if (score >= 80) health = 'excellent';
  else if (score >= 60) health = 'good';
  else if (score >= 40) health = 'fair';
  else health = 'poor';

  return { health, score: Math.round(score), reasons };
}

export function getRecentMilestones(milestones: Milestone[], count = 3): Milestone[] {
  return milestones
    .sort((a, b) => new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime())
    .slice(0, count);
}

export function getUpcomingMilestones(milestones: Milestone[], count = 3): Milestone[] {
  const now = new Date();
  return milestones
    .filter(m => m.status !== 'completed' && new Date(m.targetDate) > now)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, count);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  
  return date.toLocaleDateString();
}

export function getMilestoneStatusColor(status: Milestone['status']): string {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50';
    case 'in_progress': return 'text-blue-600 bg-blue-50';
    case 'delayed': return 'text-red-600 bg-red-50';
    case 'pending': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

export function getTrustScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}
```

---

## 📋 Phase 2: UI Components (PR #2)

### 🎨 Basic UI Components

#### 6. Progress Indicator Component
- [ ] **File**: `src/components/ui/ProgressIndicator.tsx`
```typescript
import React from 'react';

interface ProgressIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  percentage,
  size = 'md',
  showText = true,
  color = 'blue',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };

  const radius = size === 'sm' ? 14 : size === 'md' ? 20 : 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-300 ease-in-out ${colorClasses[color]}`}
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className={`absolute inset-0 flex items-center justify-center font-medium ${colorClasses[color]}`}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
```

#### 7. Trust Score Badge Component
- [ ] **File**: `src/components/ui/TrustScoreBadge.tsx`
```typescript
import React from 'react';
import { getTrustScoreColor } from '../../utils/karmaGAPProcessing';

interface TrustScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  score,
  showLabel = true,
  size = 'md',
  tooltip,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const getScoreLevel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const scoreLevel = getScoreLevel(score);
  const colorClass = getTrustScoreColor(score);

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${colorClass} bg-opacity-10`}
      title={tooltip || `Trust Score: ${score}/100 (${scoreLevel})`}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${colorClass.replace('text-', 'bg-')}`} />
      {showLabel ? (
        <span>{scoreLevel} ({score})</span>
      ) : (
        <span>{score}</span>
      )}
    </div>
  );
};
```

### 🏗️ Core Integration Components

#### 8. Karma GAP Insights Component
- [ ] **File**: `src/components/KarmaGAPInsights.tsx`
```typescript
import React from 'react';
import { ProgressIndicator } from './ui/ProgressIndicator';
import { TrustScoreBadge } from './ui/TrustScoreBadge';
import { formatRelativeTime, getRecentMilestones } from '../utils/karmaGAPProcessing';
import type { ProjectWithGAPData } from '../types/karma';

interface KarmaGAPInsightsProps {
  profile: NonNullable<ProjectWithGAPData['karmaGAPProfile']>;
  compact?: boolean;
}

export const KarmaGAPInsights: React.FC<KarmaGAPInsightsProps> = ({
  profile,
  compact = false,
}) => {
  const { stats, milestones } = profile;
  const recentMilestones = getRecentMilestones(milestones, 2);

  if (compact) {
    return (
      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
        <ProgressIndicator percentage={stats.completionRate} size="sm" />
        <TrustScoreBadge score={stats.trustScore} showLabel={false} size="sm" />
        <span className="text-sm text-gray-600">
          Updated {formatRelativeTime(stats.lastUpdateDate)}
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Project Progress</h4>
        <a
          href={`https://gap.karmahq.xyz/project/${profile.project.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          View on Karma GAP
          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <ProgressIndicator percentage={stats.completionRate} size="md" />
          <div>
            <p className="text-sm font-medium text-gray-900">Completion</p>
            <p className="text-xs text-gray-500">
              {stats.completedMilestones}/{stats.totalMilestones} milestones
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <TrustScoreBadge score={stats.trustScore} />
          <p className="text-xs text-gray-500">
            Last update: {formatRelativeTime(stats.lastUpdateDate)}
          </p>
        </div>
      </div>

      {recentMilestones.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Milestones</h5>
          <div className="space-y-2">
            {recentMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    milestone.status === 'completed'
                      ? 'bg-green-500'
                      : milestone.status === 'in_progress'
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
                <span className="text-sm text-gray-600 truncate">{milestone.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

#### 9. Enhanced Project Card
- [ ] **File**: `src/components/ProjectCard.tsx` (Update existing file)
```typescript
// Add this import at the top
import { KarmaGAPInsights } from './KarmaGAPInsights';
import type { ProjectWithGAPData } from '../types/karma';

// Update the existing ProjectCard component interface
interface ProjectCardProps {
  project: ProjectWithGAPData; // Changed from existing project type
  onVote: (projectId: string, allocation: number) => void;
  // ... other existing props
}

// In the existing ProjectCard component, add this section after the basic project info:
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onVote, ...otherProps }) => {
  return (
    <div className="project-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Existing project basic info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
      </div>

      {/* NEW: Karma GAP Integration */}
      {project.karmaGAPProfile && (
        <div className="mb-4">
          <KarmaGAPInsights profile={project.karmaGAPProfile} compact />
        </div>
      )}

      {/* Existing voting controls and other content */}
      {/* ... rest of existing component */}
    </div>
  );
};
```

---

## 📋 Phase 3: Data Integration (PR #3)

### 🔄 React Hooks

#### 10. Karma GAP Data Hook
- [ ] **File**: `src/hooks/useKarmaGAPData.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import { karmaGAPService } from '../services/karmaGAP';
import type { ProjectWithGAPData } from '../types/karma';

interface UseKarmaGAPDataResult {
  data: ProjectWithGAPData['karmaGAPProfile'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useKarmaGAPData(karmaGAPId?: string): UseKarmaGAPDataResult {
  const [data, setData] = useState<ProjectWithGAPData['karmaGAPProfile'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!karmaGAPId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await karmaGAPService.getCompleteProjectData(karmaGAPId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Karma GAP data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [karmaGAPId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
```

### 📡 API Routes

#### 11. Karma GAP Proxy API Route
- [ ] **File**: `src/pages/api/karma-gap/[...path].ts`
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { karmaGAPConfig } from '../../../config/karma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  
  if (!Array.isArray(path)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const endpoint = '/' + path.join('/');
  const url = `${karmaGAPConfig.apiBaseURL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${karmaGAPConfig.apiKey}`,
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Karma GAP API proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### 12. Project Sync API Route
- [ ] **File**: `src/pages/api/projects/sync-karma-gap.ts`
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { karmaGAPService } from '../../../services/karmaGAP';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { projectId, karmaGAPId } = req.body;

  if (!projectId || !karmaGAPId) {
    return res.status(400).json({ error: 'Missing projectId or karmaGAPId' });
  }

  try {
    // Fetch latest data from Karma GAP
    const karmaGAPProfile = await karmaGAPService.getCompleteProjectData(karmaGAPId);
    
    if (!karmaGAPProfile) {
      return res.status(404).json({ error: 'Project not found on Karma GAP' });
    }

    // TODO: Update your database with the new karma GAP data
    // This will depend on your existing database setup
    // Example:
    // await updateProjectKarmaGAPData(projectId, karmaGAPProfile);

    res.status(200).json({ 
      success: true, 
      data: karmaGAPProfile,
      message: 'Project data synced successfully' 
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync project data' });
  }
}
```

---

## 📋 Phase 4: Enhanced Features (PR #4)

### 🎯 Advanced Components

#### 13. Project Detail Modal
- [ ] **File**: `src/components/ProjectDetailModal.tsx`
```typescript
import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MilestonesTimeline } from './MilestonesTimeline';
import { UpdatesFeed } from './UpdatesFeed';
import { ImpactMetrics } from './ImpactMetrics';
import { ProgressIndicator } from './ui/ProgressIndicator';
import { TrustScoreBadge } from './ui/TrustScoreBadge';
import type { ProjectWithGAPData } from '../types/karma';

interface ProjectDetailModalProps {
  project: ProjectWithGAPData;
  isOpen: boolean;
  onClose: () => void;
  onVote?: (projectId: string, allocation: number) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onVote,
}) => {
  const { karmaGAPProfile } = project;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      {project.name}
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-500">{project.description}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {karmaGAPProfile ? (
                  <div className="space-y-6">
                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <ProgressIndicator percentage={karmaGAPProfile.stats.completionRate} size="lg" />
                        <p className="mt-2 text-sm font-medium text-gray-900">Completion Rate</p>
                      </div>
                      <div className="text-center">
                        <TrustScoreBadge score={karmaGAPProfile.stats.trustScore} size="lg" />
                        <p className="mt-2 text-sm font-medium text-gray-900">Trust Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {karmaGAPProfile.stats.totalUpdates}
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-900">Total Updates</p>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        <a href="#milestones" className="border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                          Milestones
                        </a>
                        <a href="#updates" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                          Updates
                        </a>
                        <a href="#impact" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                          Impact
                        </a>
                      </nav>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <MilestonesTimeline milestones={karmaGAPProfile.milestones} />
                      </div>
                      <div className="space-y-6">
                        <UpdatesFeed updates={karmaGAPProfile.recentUpdates} />
                        {karmaGAPProfile.impactMetrics.length > 0 && (
                          <ImpactMetrics metrics={karmaGAPProfile.impactMetrics} />
                        )}
                      </div>
                    </div>

                    {/* External Link */}
                    <div className="flex justify-center pt-4 border-t">
                      <a
                        href={`https://gap.karmahq.xyz/project/${karmaGAPProfile.project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Full Project on Karma GAP
                        <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No Karma GAP data available for this project.</p>
                  </div>
                )}

                {/* Voting Section */}
                {onVote && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-end">
                      <button
                        onClick={() => onVote(project.projectId, 0)}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Vote for this Project
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
```

#### 14. Supporting Components
- [ ] **File**: `src/components/MilestonesTimeline.tsx`
- [ ] **File**: `src/components/UpdatesFeed.tsx`
- [ ] **File**: `src/components/ImpactMetrics.tsx`
- [ ] **File**: `src/components/ProjectFilters.tsx`

---

## 🧪 Testing Requirements

### Unit Tests
- [ ] **File**: `src/services/__tests__/karmaGAP.test.ts`
- [ ] **File**: `src/components/__tests__/KarmaGAPInsights.test.tsx`
- [ ] **File**: `src/components/__tests__/ProgressIndicator.test.tsx`
- [ ] **File**: `src/hooks/__tests__/useKarmaGAPData.test.ts`

### Integration Tests
- [ ] **File**: `src/__tests__/integration/karma-gap-flow.test.ts`

### E2E Tests
- [ ] **File**: `tests/karma-gap-integration.spec.ts`

---

## 📝 Documentation

- [ ] **File**: `docs/karma-gap-integration.md`
- [ ] **File**: `README.md` (Update with Karma GAP integration info)
- [ ] **File**: `docs/api/karma-gap.md`

---

## 🚀 Deployment Checklist

### Environment Setup
- [ ] Add environment variables to staging
- [ ] Add environment variables to production
- [ ] Configure API keys and secrets
- [ ] Set up monitoring and logging

### Database Changes
- [ ] Create database migration scripts
- [ ] Test migrations on staging
- [ ] Plan production migration
- [ ] Create rollback procedures

### Feature Flags
- [ ] Implement feature flag for Karma GAP integration
- [ ] Test feature flag functionality
- [ ] Plan gradual rollout strategy

---

## ✅ Definition of Done

### Technical Requirements
- [ ] All API endpoints working correctly
- [ ] All components render without errors
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Mobile responsive design
- [ ] Accessibility standards met (WCAG 2.1 AA)

### Testing Requirements
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Performance benchmarks met
- [ ] Cross-browser compatibility verified

### Documentation Requirements
- [ ] API documentation complete
- [ ] Component documentation complete
- [ ] User guide updated
- [ ] Developer setup guide updated

### Code Quality
- [ ] Code review completed
- [ ] TypeScript strict mode compliant
- [ ] ESLint rules passing
- [ ] No console errors or warnings
- [ ] Performance optimized

---

## 🔄 Review Checklist

### Security Review
- [ ] API keys properly secured
- [ ] No sensitive data exposed in frontend
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Rate limiting configured

### Performance Review
- [ ] API response times <500ms
- [ ] Bundle size impact minimal
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Caching strategy implemented

### UX/UI Review
- [ ] Design system consistency
- [ ] Loading states user-friendly
- [ ] Error messages helpful
- [ ] Mobile experience optimized
- [ ] Accessibility tested

---

**This checklist provides a comprehensive implementation plan for integrating Karma GAP with the Breadchain crowdstaking app. Each checkbox represents a specific deliverable that can be tracked and verified during the development process.** 