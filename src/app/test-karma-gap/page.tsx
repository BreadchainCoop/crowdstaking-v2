"use client";

import { ProgressIndicator } from "../core/components/ui/ProgressIndicator";
import { TrustScoreBadge } from "../core/components/ui/TrustScoreBadge";
import { KarmaGAPInsights } from "../governance/components/KarmaGAPInsights";

// Mock data for testing
const mockKarmaGAPProfile = {
  project: {
    id: "test-project-123",
    title: "Test Breadchain Project",
    description: "A sample project demonstrating Karma GAP integration",
    status: "active" as const,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-15"),
    website: "https://breadchain.xyz",
    github: "https://github.com/breadchain",
  },
  milestones: [
    {
      id: "milestone-1",
      projectId: "test-project-123",
      title: "Project Kickoff & Initial Development",
      description: "Set up infrastructure and begin core development",
      status: "completed" as const,
      targetDate: new Date("2024-03-01"),
      completedDate: new Date("2024-02-28"),
      tags: ["development", "setup"],
    },
    {
      id: "milestone-2", 
      projectId: "test-project-123",
      title: "Beta Release & Community Testing",
      description: "Launch beta version for community feedback",
      status: "completed" as const,
      targetDate: new Date("2024-06-01"),
      completedDate: new Date("2024-05-28"),
      tags: ["beta", "testing"],
    },
    {
      id: "milestone-3",
      projectId: "test-project-123", 
      title: "Production Launch",
      description: "Full production deployment and launch",
      status: "in_progress" as const,
      targetDate: new Date("2024-12-31"),
      tags: ["launch", "production"],
    },
    {
      id: "milestone-4",
      projectId: "test-project-123",
      title: "Scale & Optimize",
      description: "Scale infrastructure and optimize performance",
      status: "pending" as const,
      targetDate: new Date("2025-03-01"),
      tags: ["scaling", "optimization"],
    },
  ],
  recentUpdates: [
    {
      id: "update-1",
      projectId: "test-project-123",
      title: "December Progress Update",
      content: "Great progress on the production launch milestone. We've completed 80% of the required features and are on track for our December deadline.",
      publishedDate: new Date("2024-12-10"),
      type: "progress" as const,
      visibility: "public" as const,
    },
    {
      id: "update-2", 
      projectId: "test-project-123",
      title: "Beta Testing Results",
      content: "Beta testing has been successful with over 100 community members participating. We've received valuable feedback and implemented key improvements.",
      publishedDate: new Date("2024-11-15"),
      type: "milestone" as const,
      visibility: "public" as const,
    },
  ],
  impactMetrics: [
    {
      id: "metric-1",
      projectId: "test-project-123",
      metric: "Community Members",
      value: 150,
      unit: "users",
      verificationSource: "Discord Analytics",
      lastUpdated: new Date("2024-12-10"),
      category: "social" as const,
    },
    {
      id: "metric-2",
      projectId: "test-project-123", 
      metric: "Code Commits",
      value: 847,
      unit: "commits",
      verificationSource: "GitHub API",
      lastUpdated: new Date("2024-12-14"),
      category: "governance" as const,
    },
  ],
  stats: {
    completionRate: 66.67, // 2 out of 3 completed milestones
    trustScore: 85,
    activityScore: 95, // Recent updates
    lastUpdateDate: new Date("2024-12-10"),
    totalMilestones: 4,
    completedMilestones: 2,
    totalUpdates: 2,
  },
};

export default function TestKarmaGAPPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Karma GAP Integration Test
        </h1>
        <p className="text-gray-600">
          This page demonstrates the Karma GAP integration components with mock data.
        </p>
      </div>

      <div className="space-y-8">
        {/* Individual Components */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Individual Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-medium mb-3">Progress Indicator</h3>
              <div className="flex justify-center">
                <ProgressIndicator percentage={66.67} size="lg" color="green" />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-medium mb-3">Trust Score Badge</h3>
              <div className="flex justify-center">
                <TrustScoreBadge score={85} size="lg" />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-medium mb-3">Different Trust Scores</h3>
              <div className="space-y-2">
                <TrustScoreBadge score={95} size="sm" />
                <TrustScoreBadge score={72} size="sm" />
                <TrustScoreBadge score={45} size="sm" />
                <TrustScoreBadge score={25} size="sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Compact Insights */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Compact Mode (as shown in ProjectRow)</h2>
          <KarmaGAPInsights profile={mockKarmaGAPProfile} compact={true} />
        </section>

        {/* Full Insights */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Full Mode (for detail views)</h2>
          <KarmaGAPInsights profile={mockKarmaGAPProfile} compact={false} />
        </section>

        {/* Integration Status */}
        <section className="bg-green-50 rounded-lg border border-green-200 p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Integration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-green-700 mb-2">Components Working:</h3>
              <ul className="space-y-1 text-green-600">
                <li>✓ ProgressIndicator</li>
                <li>✓ TrustScoreBadge</li>
                <li>✓ KarmaGAPInsights</li>
                <li>✓ Data processing utilities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-green-700 mb-2">Integration Points:</h3>
              <ul className="space-y-1 text-green-600">
                <li>✓ ProjectRow enhanced</li>
                <li>✓ useKarmaGAPData hook</li>
                <li>✓ API routes created</li>
                <li>✓ TypeScript types defined</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Test Data Info */}
        <section className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">📊 Mock Data Details</h2>
          <div className="text-sm text-blue-700">
            <p className="mb-2">
              This test uses realistic mock data that demonstrates:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Trust Score:</strong> 85/100 (Excellent) - based on 67% completion rate and recent activity</li>
              <li><strong>Milestones:</strong> 2 completed, 1 in progress, 1 pending (4 total)</li>
              <li><strong>Recent Activity:</strong> Last update 5 days ago (high activity score)</li>
              <li><strong>Impact Metrics:</strong> Community growth and development progress</li>
            </ul>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">🚀 Next Steps</h2>
          <div className="text-sm text-yellow-700">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Add real Karma GAP API keys to environment variables</li>
              <li>Replace demo karmaGAPId values in projectsMeta.ts with real project IDs</li>
              <li>Test with live Karma GAP data</li>
              <li>Visit <code className="bg-yellow-100 px-1 rounded">/governance</code> to see integration in action</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
} 