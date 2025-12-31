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
  data: {
    title: string;
    description?: string;
    endsAt?: number;
  };
  completed?: {
    createdAt: string;
  } | null;
}

export interface GapUpdate {
  uid: string;
  data: {
    title: string;
    text: string;
  };
  createdAt: string;
}

export interface GapImpact {
  uid: string;
  data: {
    title: string;
    description?: string;
    proof?: string;
  };
  createdAt: string;
}

export interface GapEndorsement {
  uid: string;
  data: {
    comment?: string;
  };
  attester: string;
  createdAt: string;
}

export interface GapTeamMember {
  data: {
    name?: string;
    role?: string;
  };
  recipient: string;
}

export interface GapGrant {
  status?: string;
  data: {
    amount?: string;
    details?: string;
  };
}

// Raw API response structure
export interface GapApiResponse {
  uid: string;
  details: {
    data: {
      title: string;
      description?: string;
      problem?: string;
      solution?: string;
      missionSummary?: string;
      imageURL?: string;
      links?: Array<{ type: string; url: string }>;
    };
  };
  milestones?: GapMilestone[];
  project_milestones?: GapMilestone[];
  updates?: GapUpdate[];
  impacts?: GapImpact[];
  endorsements?: GapEndorsement[];
  members?: GapTeamMember[];
  grants?: GapGrant[];
  createdAt?: string;
  updatedAt?: string;
}

// Normalized interface for use in components
export interface GapProject {
  uid: string;
  title: string;
  description?: string;
  problem?: string;
  solution?: string;
  missionSummary?: string;
  imageURL?: string;
  milestones?: GapMilestone[];
  updates?: GapUpdate[];
  impacts?: GapImpact[];
  endorsements?: GapEndorsement[];
  members?: GapTeamMember[];
  grants?: GapGrant[];
  createdAt?: string;
  updatedAt?: string;
  links?: Array<{ type: string; url: string }>;
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
 * Transform raw API response to normalized GapProject
 */
function transformApiResponse(raw: GapApiResponse): GapProject {
  return {
    uid: raw.uid,
    title: raw.details?.data?.title || "Untitled Project",
    description: raw.details?.data?.description,
    problem: raw.details?.data?.problem,
    solution: raw.details?.data?.solution,
    missionSummary: raw.details?.data?.missionSummary,
    imageURL: raw.details?.data?.imageURL,
    milestones: raw.milestones || raw.project_milestones || [],
    updates: raw.updates || [],
    impacts: raw.impacts || [],
    endorsements: raw.endorsements || [],
    members: raw.members || [],
    grants: raw.grants || [],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    links: raw.details?.data?.links || [],
  };
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

    const raw = await response.json() as GapApiResponse;
    return transformApiResponse(raw);
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

    const raw = await response.json() as GapApiResponse;
    return transformApiResponse(raw);
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
