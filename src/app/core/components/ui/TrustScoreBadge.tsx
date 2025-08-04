import { getTrustScoreColor } from '../../../../utils/karmaGAPProcessing';

interface TrustScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

export function TrustScoreBadge({
  score,
  showLabel = true,
  size = 'md',
  tooltip,
}: TrustScoreBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const getScoreLevel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const scoreLevel = getScoreLevel(score);
  const colorClass = getTrustScoreColor(score);

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${colorClass} bg-opacity-10`}
      title={tooltip || `Trust Score: ${score}/100 (${scoreLevel})`}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${colorClass.replace('text-', 'bg-')}`} />
      {showLabel ? (
        <span>{scoreLevel} ({score})</span>
      ) : (
        <span>{score}</span>
      )}
    </div>
  );
} 