import { Body, Heading4 } from "@breadcoop/ui";
import { GapProject } from "@/lib/gap";
import { format } from "date-fns";
import { ModalHeading, ModalContent } from "@/app/core/components/Modal/ModalUI";
import { useGapProjectData } from "../../useGapProjectData";
import { Hex } from "viem";

interface GapModalContentProps {
  address: Hex;
}

/**
 * Modal content component displaying comprehensive Karma GAP project information
 *
 * Shows all milestones, all updates, team info, and full descriptions in a standardized format
 */
export function GapModalContent({ address }: GapModalContentProps) {
  const { data, isLoading, error } = useGapProjectData(address);

  // Loading state
  if (isLoading) {
    return (
      <>
        <ModalHeading>Project Details</ModalHeading>
        <ModalContent>
          <Body className="text-surface-grey-2">Loading project details...</Body>
        </ModalContent>
      </>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <>
        <ModalHeading>Project Details</ModalHeading>
        <ModalContent>
          <Body className="text-surface-grey-2">
            Unable to load project details from Karma GAP
          </Body>
        </ModalContent>
      </>
    );
  }

  const milestones = data.milestones || [];
  const updates = data.updates || [];
  const teamMembers = data.members || [];

  return (
    <>
      <ModalHeading>{data.title || "Project Details"}</ModalHeading>
      <ModalContent>
        {/* Project Description */}
        {data.description && (
          <div className="mb-6">
            <Body className="text-sm text-surface-grey-2">
              {data.description}
            </Body>
          </div>
        )}

        {/* Milestones Section - Show ALL milestones */}
        {milestones.length > 0 && (
          <div className="mb-6">
            <Heading4 className="text-lg mb-3">
              Milestones ({milestones.length})
            </Heading4>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.uid}
                  className="border-l-2 border-surface-grey-3 pl-4 py-1"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-base mt-0.5 font-bold">
                      {milestone.completed ? "✓" : "○"}
                    </span>
                    <div className="flex-1">
                      <Body className="text-sm font-bold text-surface-grey-2">
                        {milestone.title}
                      </Body>
                      {milestone.description && (
                        <Body className="text-xs text-surface-grey-2 mt-1">
                          {milestone.description}
                        </Body>
                      )}
                      <div className="flex gap-3 mt-2 text-xs text-surface-grey-2 opacity-70">
                        {milestone.completedAt && (
                          <span>
                            Completed:{" "}
                            {format(new Date(milestone.completedAt), "MMM d, yyyy")}
                          </span>
                        )}
                        {milestone.dueDate && !milestone.completed && (
                          <span>
                            Due: {format(new Date(milestone.dueDate), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Updates Section - Show ALL updates */}
        {updates.length > 0 && (
          <div className="mb-6">
            <Heading4 className="text-lg mb-3">
              Updates ({updates.length})
            </Heading4>
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.uid} className="border-l-2 border-surface-grey-3 pl-4 py-1">
                  <Body className="text-sm font-bold text-surface-grey-2 mb-1">
                    {update.title}
                  </Body>
                  {update.text && (
                    <Body className="text-xs text-surface-grey-2 mb-2">
                      {update.text}
                    </Body>
                  )}
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

        {/* Team Section - Show team member details */}
        {teamMembers.length > 0 && (
          <div className="mb-4">
            <Heading4 className="text-lg mb-3">
              Team ({teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""})
            </Heading4>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.address} className="flex items-start gap-2">
                  <Body className="text-xs text-surface-grey-2">
                    {member.name || `${member.address.slice(0, 6)}...${member.address.slice(-4)}`}
                    {member.role && <span className="opacity-70"> - {member.role}</span>}
                  </Body>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {milestones.length === 0 && updates.length === 0 && teamMembers.length === 0 && (
          <Body className="text-sm text-surface-grey-2">
            No additional project details available from Karma GAP
          </Body>
        )}
      </ModalContent>
    </>
  );
}
