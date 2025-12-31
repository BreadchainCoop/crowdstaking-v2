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
 * Markdown renderer component with consistent styling and linkification fallback
 */
function MarkdownContent({ content }: { content: string | undefined }) {
  // Guard against undefined/null content
  if (!content) return null;

  // First try to linkify plain URLs that markdown might miss
  const urlRegex = /(https?:\/\/[^\s\)]+)/g;
  const processedContent = content.replace(urlRegex, (url) => {
    // If the URL is not already wrapped in markdown link syntax
    if (!content.includes(`[`) || !content.includes(`](${url})`)) {
      return `[${url}](${url})`;
    }
    return url;
  });

  return (
    <ReactMarkdown
      components={{
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-words"
          />
        ),
        p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0 whitespace-pre-wrap" />,
        br: () => <br />,
      }}
    >
      {processedContent}
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
      <ModalHeading>{projectMeta?.name || data.title || "Project Details"}</ModalHeading>
      <ModalContent>
        {/* Project Description Section */}
        {(data.description || data.missionSummary || data.problem || data.solution) && (
          <div className="mb-6 pb-6 border-b border-surface-grey-3">
            <Heading4 className="text-lg mb-3">About</Heading4>
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

        {/* Endorsements Section */}
        {endorsements.length > 0 && (
          <div className="mb-6 pb-6 border-b border-surface-grey-3">
            <Heading4 className="text-lg mb-3">
              Endorsements ({endorsements.length})
            </Heading4>
            <div className="space-y-3">
              {endorsements.map((endorsement) => (
                <div key={endorsement.uid} className="p-3 bg-surface-grey-4 rounded-lg">
                  {endorsement.data.comment && (
                    <Body className="text-xs text-surface-grey-2 mb-2">
                      <MarkdownContent content={endorsement.data.comment} />
                    </Body>
                  )}
                  <div className="flex items-center gap-2 text-xs text-surface-grey-2 opacity-70">
                    <span className="font-mono text-[10px] truncate max-w-[120px]">
                      {endorsement.attester}
                    </span>
                    {endorsement.createdAt && (
                      <>
                        <span>•</span>
                        <span>{format(new Date(endorsement.createdAt), "MMM d, yyyy")}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones Section - Show ALL milestones */}
        {milestones.length > 0 && (
          <div className="mb-6 pb-6 border-b border-surface-grey-3">
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
                        {milestone.completed?.createdAt && (
                          <span>
                            Completed:{" "}
                            {format(new Date(milestone.completed.createdAt), "MMM d, yyyy")}
                          </span>
                        )}
                        {milestone.data.endsAt && !milestone.completed && (
                          <span>
                            Due: {format(new Date(milestone.data.endsAt * 1000), "MMM d, yyyy")}
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
          <div className="mb-6 pb-6 border-b border-surface-grey-3">
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
                <LiftedButton className="flex items-center gap-2 whitespace-nowrap">
                  Learn More
                  <ArrowUpRightIcon size={20} />
                </LiftedButton>
              </a>
            )}
            {projectHomepage && (
              <a href={projectHomepage} target="_blank" rel="noopener noreferrer">
                <LiftedButton className="flex items-center gap-2 whitespace-nowrap">
                  Homepage
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
