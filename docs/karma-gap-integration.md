# Karma GAP Integration

This document describes the Karma GAP integration in the Breadchain crowdstaking app, which provides voters with real-time project progress data, milestone updates, and impact metrics.

## Overview

The integration displays project progress information from Karma GAP (Global Allocation Platform) directly on the governance voting page, helping voters make more informed funding allocation decisions.

## Features

- **Progress Indicators**: Visual completion rates for project milestones
- **Trust Scores**: Calculated based on activity, completion rates, and updates
- **Recent Updates**: Display of latest project updates and milestones
- **External Links**: Direct links to view full project details on Karma GAP

## Implementation

### Core Components

#### 1. Configuration (`src/config/karma.ts`)
```typescript
export const karmaGAPConfig = {
  apiBaseURL: process.env.NEXT_PUBLIC_KARMA_GAP_API_URL || 'https://api.karmahq.xyz/api',
  apiKey: process.env.KARMA_GAP_API_KEY,
  // ... other config options
};
```

#### 2. Type Definitions (`src/types/karma.ts`)
- `KarmaGAPProject`: Core project data from Karma GAP
- `Milestone`: Project milestone information
- `ProjectUpdate`: Project updates and announcements
- `ImpactMetric`: Impact measurement data
- `ProjectWithGAPData`: Extended project data including Karma GAP info

#### 3. API Service (`src/services/karmaGAP.ts`)
```typescript
export class KarmaGAPService {
  async getCompleteProjectData(karmaGAPId: string): Promise<ProjectProfile | null>
  // ... other methods
}
```

#### 4. UI Components
- `ProgressIndicator`: Circular progress visualization
- `TrustScoreBadge`: Trust score display with color coding
- `KarmaGAPInsights`: Main component combining all Karma GAP data

#### 5. React Hook (`src/hooks/useKarmaGAPData.ts`)
```typescript
export function useKarmaGAPData(karmaGAPId?: string): UseKarmaGAPDataResult {
  // Handles data fetching, loading states, and error handling
}
```

### Integration Points

#### ProjectRow Enhancement
The main integration point is in `src/app/governance/components/ProjectRow.tsx`, where Karma GAP insights are displayed for projects that have linked their Karma GAP profiles.

```typescript
// Karma GAP data is fetched and displayed conditionally
{karmaGAPData && !karmaGAPLoading && (
  <div className="mt-3">
    <KarmaGAPInsights profile={karmaGAPData} compact />
  </div>
)}
```

#### Project Metadata
Projects can be linked to Karma GAP by adding a `karmaGAPId` field to their metadata in `src/app/projectsMeta.ts`:

```typescript
{
  name: "Project Name",
  // ... other fields
  karmaGAPId: "karma-gap-project-id", // Link to Karma GAP project
}
```

## Environment Setup

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# Karma GAP Integration
NEXT_PUBLIC_KARMA_GAP_API_URL=https://api.karmahq.xyz/api
KARMA_GAP_API_KEY=your_api_key_here
KARMA_GAP_WEBHOOK_SECRET=your_webhook_secret_here
```

### API Key Setup

1. Obtain a Karma GAP API key from [Karma GAP Platform](https://gap.karmahq.xyz)
2. Add the API key to your environment variables
3. Configure webhook secrets for real-time updates (optional)

## API Routes

### Proxy Endpoint
- **Route**: `/api/karma-gap/[...path]`
- **Purpose**: Secure proxy for Karma GAP API calls
- **Features**: Request caching, error handling, API key management

### Project Sync
- **Route**: `/api/projects/sync-karma-gap`
- **Method**: POST
- **Purpose**: Manual synchronization of project data
- **Body**: `{ projectId: string, karmaGAPId: string }`

## Data Flow

1. **Project Setup**: Projects link their Karma GAP profiles via `karmaGAPId` in metadata
2. **Data Fetching**: `useKarmaGAPData` hook fetches project data when component mounts
3. **Display**: `KarmaGAPInsights` component renders progress indicators and trust scores
4. **Updates**: Data can be refreshed via the sync API or automatically cached

## Trust Score Calculation

The trust score is calculated based on:
- **Completion Rate (40%)**: Percentage of completed milestones
- **Activity Score (30%)**: Recency of updates (decreases 2 points per day since last update)
- **Update Frequency (30%)**: Number of project updates (up to 30 points)

Trust score levels:
- **Excellent**: 80-100 points
- **Good**: 60-79 points  
- **Fair**: 40-59 points
- **Poor**: 0-39 points

## UI Components Usage

### Basic Progress Indicator
```typescript
<ProgressIndicator 
  percentage={75} 
  size="md" 
  color="green" 
/>
```

### Trust Score Badge
```typescript
<TrustScoreBadge 
  score={85} 
  showLabel={true} 
  size="md" 
/>
```

### Complete Insights Panel
```typescript
<KarmaGAPInsights 
  profile={karmaGAPProfile} 
  compact={false} 
/>
```

## Customization

### Adding New Projects
1. Add project to `projectsMeta.ts` with `karmaGAPId`
2. Ensure the Karma GAP project ID is valid
3. The integration will automatically display for linked projects

### Styling Customization
Components use Tailwind CSS classes and can be customized by:
- Modifying color schemes in utility functions
- Adjusting size variants in component props
- Updating layout in `KarmaGAPInsights` component

### Data Processing
Customize data processing by modifying functions in `src/utils/karmaGAPProcessing.ts`:
- `calculateProjectHealth()`: Adjust health calculation logic
- `getTrustScoreColor()`: Modify trust score color mapping
- `formatRelativeTime()`: Change time formatting

## Error Handling

The integration includes comprehensive error handling:
- **API Failures**: Graceful degradation when Karma GAP is unavailable
- **Invalid Data**: Validation and fallbacks for malformed responses
- **Network Issues**: Retry logic with exponential backoff
- **Missing Projects**: Silent handling of projects not found on Karma GAP

## Performance Considerations

- **Caching**: API responses cached for 5 minutes by default
- **Lazy Loading**: Data only fetched for projects with `karmaGAPId`
- **Compact Mode**: Lightweight display option for listing views
- **Error Boundaries**: Prevents integration issues from breaking main UI

## Security

- **API Key Protection**: Keys stored securely in environment variables
- **Proxy Routes**: API calls routed through backend to hide credentials
- **Input Validation**: All user inputs validated before API calls
- **CORS Handling**: Proper CORS configuration for external API access

## Future Enhancements

Potential improvements for future versions:
1. **Real-time Updates**: Webhook integration for instant data updates
2. **Advanced Filtering**: Filter projects by trust score or activity level
3. **Detailed Modals**: Full project detail views with complete milestone timelines
4. **Admin Dashboard**: Management interface for linking/unlinking projects
5. **Analytics**: Track correlation between Karma GAP data and voting patterns

## Troubleshooting

### Common Issues

1. **No Data Displayed**: Check `karmaGAPId` in project metadata
2. **API Errors**: Verify API key and network connectivity
3. **Styling Issues**: Ensure Tailwind CSS classes are available
4. **Type Errors**: Run `pnpm tsc --noEmit` to check TypeScript compilation

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=karma-gap:*
```

This will log all API calls and data processing steps to the console.

## Support

For issues with the Karma GAP integration:
1. Check this documentation first
2. Review the [Karma GAP API Documentation](https://documenter.getpostman.com/view/36647319/2sAXxQdrkZ)
3. Open an issue in the project repository with detailed error information 

## 🎉 Karma GAP Integration Complete!

I've successfully implemented a comprehensive Karma GAP integration for the Breadchain crowdstaking app. Here's what has been accomplished:

### ✅ Phase 1: Foundation Setup (COMPLETED)
- ✅ **Configuration**: Created `src/config/karma.ts` with API settings and endpoints
- ✅ **Type Definitions**: Added comprehensive TypeScript interfaces in `src/types/karma.ts`
- ✅ **API Service**: Implemented `KarmaGAPService` with complete data fetching capabilities
- ✅ **Utilities**: Created data processing functions for health calculations and formatting

### ✅ Phase 2: UI Components (COMPLETED)  
- ✅ **ProgressIndicator**: Circular progress visualization component
- ✅ **TrustScoreBadge**: Trust score display with color-coded levels
- ✅ **KarmaGAPInsights**: Main integration component with compact and full modes

### ✅ Phase 3: Data Integration (COMPLETED)
- ✅ **React Hook**: `useKarmaGAPData` for data fetching with loading/error states
- ✅ **API Routes**: Proxy endpoints for secure Karma GAP API access
- ✅ **Project Enhancement**: Updated `ProjectRow` component to display Karma GAP data

### ✅ Core Features Implemented

1. **Real-time Progress Data**: Shows completion rates and milestone progress
2. **Trust Scoring**: Calculates trust scores based on activity, completion, and updates
3. **Recent Updates**: Displays latest project milestones and announcements
4. **External Links**: Direct integration with Karma GAP platform
5. **Responsive Design**: Works on both mobile and desktop layouts
6. **Error Handling**: Graceful degradation when data is unavailable
7. **Performance Optimization**: Caching and lazy loading

### 🔧 Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Karma GAP Integration                    │
├─────────────────────────────────────────────────────────────┤
│ Frontend Components:                                        │
│ • ProjectRow (enhanced with Karma GAP data)                │
│ • KarmaGAPInsights (main display component)                │
│ • ProgressIndicator (circular progress bars)               │
│ • TrustScoreBadge (trust score visualization)              │
├─────────────────────────────────────────────────────────────┤
│ Data Layer:                                                 │
│ • useKarmaGAPData (React hook for data fetching)           │
│ • KarmaGAPService (API service class)                      │
│ • karmaGAPProcessing (utility functions)                   │
├─────────────────────────────────────────────────────────────┤
│ API Integration:                                            │
│ • /api/karma-gap/[...path] (secure proxy)                  │
│ • /api/projects/sync-karma-gap (manual sync)               │
├─────────────────────────────────────────────────────────────┤
│ Configuration:                                              │
│ • Environment variables for API keys                       │
│ • Project metadata linking (karmaGAPId field)              │
│ • Caching and error handling                               │
└─────────────────────────────────────────────────────────────┘
```

### 📊 Integration Points

**Governance Page Enhancement**: Projects with linked Karma GAP profiles now display:
- **Progress completion rates** with visual indicators
- **Trust scores** with color-coded badges (Excellent/Good/Fair/Poor)
- **Recent milestone updates** with status indicators
- **Last update timestamps** in human-readable format
- **Direct links** to view full details on Karma GAP

### 🚀 How to Use

1. **Add Environment Variables**:
   ```bash
   NEXT_PUBLIC_KARMA_GAP_API_URL=https://api.karmahq.xyz/api
   KARMA_GAP_API_KEY=your_api_key_here
   KARMA_GAP_WEBHOOK_SECRET=your_webhook_secret_here
   ```

2. **Link Projects**: Add `karmaGAPId` to project metadata:
   ```typescript
   // In src/app/projectsMeta.ts
   karmaGAPId: "real-karma-gap-project-id"
   ```

3. **Deploy**: The integration works automatically for linked projects!

### 📈 Trust Score Algorithm

The trust score calculation provides voters with a reliable metric:
- **40% Completion Rate**: Percentage of milestones completed
- **30% Activity Score**: Recency of updates (fresh = higher score)  
- **30% Update Frequency**: Consistency of project communications

### 🛡️ Security & Performance

- **API Key Protection**: Secure backend proxy 