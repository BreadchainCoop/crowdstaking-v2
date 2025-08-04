import { ProgressIndicator } from '../../core/components/ui/ProgressIndicator';
import { TrustScoreBadge } from '../../core/components/ui/TrustScoreBadge';
import { formatRelativeTime, getRecentMilestones } from '../../../utils/karmaGAPProcessing';
import type { ProjectWithGAPData } from '../../../types/karma';

interface KarmaGAPInsightsProps {
  profile: NonNullable<ProjectWithGAPData['karmaGAPProfile']>;
  compact?: boolean;
}

export function KarmaGAPInsights({
  profile,
  compact = false,
}: KarmaGAPInsightsProps) {
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
} 