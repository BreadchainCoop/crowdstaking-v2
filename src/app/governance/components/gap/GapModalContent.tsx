import { Body, Heading4, LiftedButton } from "@breadcoop/ui";
import { GapProject } from "@/lib/gap";
import { format } from "date-fns";
import { ModalHeading, ModalContent } from "@/app/core/components/Modal/ModalUI";
import { useGapProjectData } from "../../useGapProjectData";
import { Hex } from "viem";
import { projectsMeta } from "@/app/projectsMeta";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";

interface GapModalContentProps {
  address: Hex;
}

/**
 * Markdown renderer component with consistent styling
 */
function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          />
        ),
        p: ({ node, ...props }) => <span {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
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

  // Find project homepage from links (look for website type)
  const projectHomepage = data.links?.find(
    (link) => link.type?.toLowerCase() === "website" || link.type?.toLowerCase() === "homepage"
  )?.url;

  return (
    <>
      <ModalHeading>{data.title || "Project Details"}</ModalHeading>
      <ModalContent>
        {/* Project Description - Use missionSummary if description is not available */}
        {(data.description || data.missionSummary || data.problem || data.solution) && (
          <div className="mb-6">
            {data.description && (
              <Body className="text-sm text-surface-grey-2 mb-3">
                <MarkdownContent content={data.description} />
              </Body>
            )}
            {!data.description && data.missionSummary && (
              <Body className="text-sm text-surface-grey-2 mb-3">
                <strong>Mission:</strong> <MarkdownContent content={data.missionSummary} />
              </Body>
            )}
            {data.problem && (
              <Body className="text-sm text-surface-grey-2 mb-2">
                <strong>Problem:</strong> <MarkdownContent content={data.problem} />
              </Body>
            )}
            {data.solution && (
              <Body className="text-sm text-surface-grey-2">
                <strong>Solution:</strong> <MarkdownContent content={data.solution} />
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
                    <MarkdownContent content={impact.data.title} />
                  </Body>
                  {impact.data.description && (
                    <Body className="text-xs text-surface-grey-2 mb-2">
                      <MarkdownContent content={impact.data.description} />
                    </Body>
                  )}
                  {impact.data.proof && (
                    <Body className="text-xs text-surface-grey-2 mb-2 italic">
                      Proof: <MarkdownContent content={impact.data.proof} />
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
                        <MarkdownContent content={milestone.data.title} />
                      </Body>
                      {milestone.data.description && (
                        <Body className="text-xs text-surface-grey-2 mt-1">
                          <MarkdownContent content={milestone.data.description} />
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
                    <MarkdownContent content={update.data.title} />
                  </Body>
                  {update.data.text && (
                    <Body className="text-xs text-surface-grey-2 mb-2">
                      <MarkdownContent content={update.data.text} />
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

        {/* Action Buttons */}
        {(gapUrl || projectHomepage) && (
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            {gapUrl && (
              <a href={gapUrl} target="_blank" rel="noopener noreferrer">
                <LiftedButton className="flex items-center gap-2">
                  Learn More
                  <ArrowUpRightIcon size={20} />
                </LiftedButton>
              </a>
            )}
            {projectHomepage && (
              <a href={projectHomepage} target="_blank" rel="noopener noreferrer">
                <LiftedButton className="flex items-center gap-2">
                  Project Homepage
                  <ArrowUpRightIcon size={20} />
                </LiftedButton>
              </a>
            )}
          </div>
        )}
      </ModalContent>
    </>
  );
}
