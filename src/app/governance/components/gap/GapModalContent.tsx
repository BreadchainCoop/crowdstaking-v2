import { Body, Heading4, LiftedButton } from "@breadcoop/ui";
import { GapProject } from "@/lib/gap";
import { format } from "date-fns";
import { ModalHeading, ModalContent } from "@/app/core/components/Modal/ModalUI";
import { useGapProjectData } from "../../useGapProjectData";
import { Hex } from "viem";
import { projectsMeta } from "@/app/projectsMeta";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

interface GapModalContentProps {
  address: Hex;
}

/**
 * Helper function to convert text with URLs into clickable links
 */
function linkifyText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

/**
 * Modal content component displaying comprehensive Karma GAP project information
 *
 * Shows all milestones, all updates, impacts, and full descriptions in a standardized format
 */
export function GapModalContent({ address }: GapModalContentProps) {
  const { data, isLoading, error } = useGapProjectData(address);
  const projectMeta = projectsMeta[address];
  const gapUrl = projectMeta?.link || "";

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
  const impacts = data.impacts || [];
  const endorsements = data.endorsements || [];

  return (
    <>
      <ModalHeading>{data.title || "Project Details"}</ModalHeading>
      <ModalContent>
        {/* Project Description - Use missionSummary if description is not available */}
        {(data.description || data.missionSummary || data.problem || data.solution) && (
          <div className="mb-6">
            {data.description && (
              <Body className="text-sm text-surface-grey-2 mb-3">
                {linkifyText(data.description)}
              </Body>
            )}
            {!data.description && data.missionSummary && (
              <Body className="text-sm text-surface-grey-2 mb-3">
                <strong>Mission:</strong> {linkifyText(data.missionSummary)}
              </Body>
            )}
            {data.problem && (
              <Body className="text-sm text-surface-grey-2 mb-2">
                <strong>Problem:</strong> {linkifyText(data.problem)}
              </Body>
            )}
            {data.solution && (
              <Body className="text-sm text-surface-grey-2">
                <strong>Solution:</strong> {linkifyText(data.solution)}
              </Body>
            )}
          </div>
        )}

        {/* Endorsements Count */}
        {endorsements.length > 0 && (
          <div className="mb-4 p-3 bg-surface-grey-4 rounded-lg">
            <Body className="text-sm font-bold text-surface-grey-2">
              {endorsements.length} Endorsement{endorsements.length !== 1 ? "s" : ""}
            </Body>
          </div>
        )}

        {/* Impacts Section */}
        {impacts.length > 0 && (
          <div className="mb-6">
            <Heading4 className="text-lg mb-3">
              Impact ({impacts.length})
            </Heading4>
            <div className="space-y-4">
              {impacts.map((impact) => (
                <div key={impact.uid} className="border-l-2 border-green-500 pl-4 py-1">
                  <Body className="text-sm font-bold text-surface-grey-2 mb-1">
                    {linkifyText(impact.data.title)}
                  </Body>
                  {impact.data.description && (
                    <Body className="text-xs text-surface-grey-2 mb-2">
                      {linkifyText(impact.data.description)}
                    </Body>
                  )}
                  {impact.data.proof && (
                    <Body className="text-xs text-surface-grey-2 mb-2 italic">
                      Proof: {linkifyText(impact.data.proof)}
                    </Body>
                  )}
                  {impact.createdAt && (
                    <Body className="text-xs text-surface-grey-2 opacity-70">
                      {format(new Date(impact.createdAt), "MMM d, yyyy")}
                    </Body>
                  )}
                </div>
              ))}
            </div>
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
                        {linkifyText(milestone.data.title)}
                      </Body>
                      {milestone.data.description && (
                        <Body className="text-xs text-surface-grey-2 mt-1">
                          {linkifyText(milestone.data.description)}
                        </Body>
                      )}
                      <div className="flex gap-3 mt-2 text-xs text-surface-grey-2 opacity-70">
                        {milestone.completedAt && (
                          <span>
                            Completed:{" "}
                            {format(new Date(milestone.completedAt), "MMM d, yyyy")}
                          </span>
                        )}
                        {milestone.data.endsAt && !milestone.completed && (
                          <span>
                            Due: {format(new Date(milestone.data.endsAt), "MMM d, yyyy")}
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
                <div key={update.uid} className="border-l-2 border-blue-500 pl-4 py-1">
                  <Body className="text-sm font-bold text-surface-grey-2 mb-1">
                    {linkifyText(update.data.title)}
                  </Body>
                  {update.data.text && (
                    <Body className="text-xs text-surface-grey-2 mb-2">
                      {linkifyText(update.data.text)}
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

        {/* View Full Profile Button */}
        {gapUrl && (
          <div className="mt-6 flex justify-center">
            <a href={gapUrl} target="_blank" rel="noopener noreferrer">
              <LiftedButton className="flex items-center gap-2">
                View Full Karma GAP Profile
                <ArrowUpRightIcon size={20} />
              </LiftedButton>
            </a>
          </div>
        )}
      </ModalContent>
    </>
  );
}
