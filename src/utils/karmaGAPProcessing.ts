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

// Time-based filtering functions for activities
export function getLastMonthDateRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return { start, end };
}

export function getCurrentPeriodDateRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of current month
  return { start, end };
}

export function filterActivitiesByDateRange<T extends { publishedDate: Date | string }>(
  activities: T[],
  startDate: Date,
  endDate: Date
): T[] {
  console.log(`filterActivitiesByDateRange: Filtering ${activities.length} activities from ${startDate.toISOString()} to ${endDate.toISOString()}`);
  
  const filtered = activities.filter(activity => {
    const activityDate = new Date(activity.publishedDate);
    const isInRange = activityDate >= startDate && activityDate <= endDate;
    console.log(`filterActivitiesByDateRange: Activity date ${activityDate.toISOString()} in range: ${isInRange}`);
    return isInRange;
  });
  
  console.log(`filterActivitiesByDateRange: Returned ${filtered.length} activities`);
  return filtered;
}

export function getRecentActivities<T extends { publishedDate: Date | string }>(
  activities: T[],
  period: 'last-month' | 'current-period' = 'last-month'
): T[] {
  console.log(`getRecentActivities: Input activities count: ${activities.length}`);
  
  const { start, end } = period === 'last-month' 
    ? getLastMonthDateRange() 
    : getCurrentPeriodDateRange();
  
  console.log(`getRecentActivities: Date range: ${start.toISOString()} to ${end.toISOString()}`);
  
  const filtered = filterActivitiesByDateRange(activities, start, end);
  console.log(`getRecentActivities: Filtered activities count: ${filtered.length}`);
  
  return filtered;
}

export function getActivitiesInTimeframe<T extends { publishedDate: Date | string }>(
  activities: T[],
  timeframe: { start: Date; end: Date }
): T[] {
  return filterActivitiesByDateRange(activities, timeframe.start, timeframe.end);
} 