/**
 * Karma GAP API Client
 *
 * Fetches project and community data from the Karma Grantee Accountability Protocol (GAP)
 * API endpoint: https://gapapi.karmahq.xyz
 */

const GAP_API_BASE = "https://gapapi.karmahq.xyz";

// TypeScript interfaces for GAP data structures
export interface GapMilestone {
  uid: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
}

export interface GapUpdate {
  uid: string;
  title: string;
  text: string;
  createdAt: string;
}

export interface GapTeamMember {
  address: string;
  name?: string;
  role?: string;
}

export interface GapCommunity {
  name: string;
  uid: string;
}

export interface GapProject {
  uid: string;
  title: string;
  description: string;
  problemStatement?: string;
  solution?: string;
  missionSummary?: string;
  logoUrl?: string;
  milestones?: GapMilestone[];
  updates?: GapUpdate[];
  members?: GapTeamMember[];
  communities?: GapCommunity[];
  grantsReceived?: number;
  endorsementCount?: number;
  createdAt?: string;
  updatedAt?: string;
  github?: string;
  website?: string;
  twitter?: string;
}

/**
 * Extract slug from Karma GAP URL
 * Supports both /project/ and /community/ URL patterns
 */
export function extractGapSlug(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const projectMatch = url.match(/\/project\/([^\/\?#]+)/);
  if (projectMatch) return projectMatch[1];

  const communityMatch = url.match(/\/community\/([^\/\?#]+)/);
  if (communityMatch) return communityMatch[1];

  return null;
}

/**
 * Determine if URL is for a project or community
 */
export function getGapType(url: string): "project" | "community" | null {
  if (!url || typeof url !== "string") return null;

  if (url.includes("/project/")) return "project";
  if (url.includes("/community/")) return "community";

  return null;
}

/**
 * Fetch project data by slug
 */
export async function getProjectBySlug(slug: string): Promise<GapProject | null> {
  try {
    const response = await fetch(`${GAP_API_BASE}/projects/${encodeURIComponent(slug)}`);

    if (!response.ok) {
      console.error(`GAP API error for project ${slug}:`, response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data as GapProject;
  } catch (error) {
    console.error(`Failed to fetch GAP project ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch community data by slug
 */
export async function getCommunityBySlug(slug: string): Promise<GapProject | null> {
  try {
    const response = await fetch(`${GAP_API_BASE}/communities/${encodeURIComponent(slug)}`);

    if (!response.ok) {
      console.error(`GAP API error for community ${slug}:`, response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data as GapProject;
  } catch (error) {
    console.error(`Failed to fetch GAP community ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch project milestones
 */
export async function getProjectMilestones(projectUid: string): Promise<GapMilestone[]> {
  try {
    const response = await fetch(`${GAP_API_BASE}/projects/${encodeURIComponent(projectUid)}/milestones`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to fetch milestones for ${projectUid}:`, error);
    return [];
  }
}

/**
 * Fetch project updates
 */
export async function getProjectUpdates(projectUid: string): Promise<GapUpdate[]> {
  try {
    const response = await fetch(`${GAP_API_BASE}/projects/${encodeURIComponent(projectUid)}/updates`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to fetch updates for ${projectUid}:`, error);
    return [];
  }
}
