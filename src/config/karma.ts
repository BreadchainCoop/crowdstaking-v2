export const karmaGAPConfig = {
  apiBaseURL: process.env.NEXT_PUBLIC_KARMA_GAP_API_URL || 'https://api.karmahq.xyz/api',
  apiKey: process.env.KARMA_GAP_API_KEY,
  webhookSecret: process.env.KARMA_GAP_WEBHOOK_SECRET,
  cacheExpiry: {
    milestones: 24 * 60 * 60 * 1000, // 24 hours
    updates: 6 * 60 * 60 * 1000,     // 6 hours
    impact: 24 * 60 * 60 * 1000,     // 24 hours
  },
  retryConfig: {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
  },
  endpoints: {
    projects: '/projects',
    milestones: '/projects/{projectId}/milestones',
    updates: '/projects/{projectId}/updates',
    impact: '/projects/{projectId}/impact',
    grants: '/projects/{projectId}/grants',
    attestations: '/projects/{projectId}/attestations',
  },
}; 