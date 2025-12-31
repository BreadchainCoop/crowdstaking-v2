import { Body, Heading4 } from "@breadcoop/ui";
import { GapProject } from "@/lib/gap";
import { format } from "date-fns";

interface GapTooltipContentProps {
  data: GapProject | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Tooltip content component displaying Karma GAP project information
 *
 * Shows milestones, updates, and team info in a compact, scannable format
 */
export function GapTooltipContent({
  data,
  isLoading,
  error,
}: GapTooltipContentProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-[350px] p-2">
        <Body className="text-surface-grey-2">Loading project details...</Body>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="max-w-[350px] p-2">
        <Body className="text-surface-grey-2">
          Unable to load project details
        </Body>
      </div>
    );
  }

  // Extract recent milestones (max 3, prioritize incomplete then completed)
  const milestones = data.milestones || [];
  const incompleteMilestones = milestones.filter((m) => !m.completed).slice(0, 2);
  const completedMilestones = milestones.filter((m) => m.completed).slice(0, 3 - incompleteMilestones.length);
  const displayMilestones = [...incompleteMilestones, ...completedMilestones];

  // Extract recent updates (max 2)
  const recentUpdates = (data.updates || []).slice(0, 2);

  // Team count
  const teamCount = data.members?.length || 0;

  return (
    <div className="max-w-[350px]">
      {/* Project Description */}
      {data.description && (
        <div className="mb-3">
          <Body className="text-xs text-surface-grey-2 line-clamp-2">
            {data.description}
          </Body>
        </div>
      )}

      {/* Milestones Section */}
      {displayMilestones.length > 0 && (
        <div className="mb-3">
          <Heading4 className="text-sm mb-2">Milestones</Heading4>
          <div className="space-y-1.5">
            {displayMilestones.map((milestone) => (
              <div key={milestone.uid} className="flex items-start gap-2">
                <span className="text-sm mt-0.5">
                  {milestone.completed ? "✓" : "○"}
                </span>
                <Body className="text-xs text-surface-grey-2 line-clamp-1 flex-1">
                  {milestone.title}
                </Body>
              </div>
            ))}
          </div>
          {milestones.length > 3 && (
            <Body className="text-xs text-surface-grey-2 mt-1.5">
              +{milestones.length - 3} more milestone{milestones.length - 3 !== 1 ? "s" : ""}
            </Body>
          )}
        </div>
      )}

      {/* Recent Updates Section */}
      {recentUpdates.length > 0 && (
        <div className="mb-3">
          <Heading4 className="text-sm mb-2">Recent Updates</Heading4>
          <div className="space-y-2">
            {recentUpdates.map((update) => (
              <div key={update.uid}>
                <Body className="text-xs font-bold text-surface-grey-2 line-clamp-1">
                  {update.title}
                </Body>
                {update.createdAt && (
                  <Body className="text-xs text-surface-grey-2 opacity-70">
                    {format(new Date(update.createdAt), "MMM d, yyyy")}
                  </Body>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Section */}
      {teamCount > 0 && (
        <div>
          <Body className="text-xs text-surface-grey-2">
            Team: {teamCount} member{teamCount !== 1 ? "s" : ""}
          </Body>
        </div>
      )}

      {/* Empty state */}
      {displayMilestones.length === 0 && recentUpdates.length === 0 && teamCount === 0 && (
        <Body className="text-xs text-surface-grey-2">
          No additional project details available
        </Body>
      )}
    </div>
  );
}
