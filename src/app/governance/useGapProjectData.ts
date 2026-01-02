import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Hex } from "viem";
import {
  extractGapSlug,
  getGapType,
  getProjectBySlug,
  getCommunityBySlug,
  GapProject,
} from "@/lib/gap";
import { projectsMeta } from "@/app/projectsMeta";

/**
 * React Query hook to fetch Karma GAP project data
 *
 * Automatically extracts the GAP slug from the project's link URL
 * and fetches data from the Karma GAP API
 */
export function useGapProjectData(address: Hex) {
  const projectMeta = projectsMeta[address];

  // Extract slug and type from GAP URL
  const gapSlug = projectMeta?.link ? extractGapSlug(projectMeta.link) : null;
  const gapType = projectMeta?.link ? getGapType(projectMeta.link) : null;

  return useQuery<GapProject | null>({
    queryKey: ["gap-project", gapSlug, gapType],
    queryFn: async () => {
      if (!gapSlug || !gapType) return null;

      // Fetch based on type (project vs community)
      if (gapType === "community") {
        return await getCommunityBySlug(gapSlug);
      } else {
        return await getProjectBySlug(gapSlug);
      }
    },
    enabled: !!gapSlug && !!gapType, // Only run query if GAP slug exists
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: keepPreviousData,
    retry: 2, // Retry failed requests twice
  });
}
