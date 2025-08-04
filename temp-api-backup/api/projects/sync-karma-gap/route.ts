import { NextRequest, NextResponse } from 'next/server';
import { karmaGAPService } from '../../../../services/karmaGAP';

export async function POST(request: NextRequest) {
  try {
    const { projectId, karmaGAPId } = await request.json();

    if (!projectId || !karmaGAPId) {
      return NextResponse.json(
        { error: 'Missing projectId or karmaGAPId' }, 
        { status: 400 }
      );
    }

    // Fetch latest data from Karma GAP
    const karmaGAPProfile = await karmaGAPService.getCompleteProjectData(karmaGAPId);
    
    if (!karmaGAPProfile) {
      return NextResponse.json(
        { error: 'Project not found on Karma GAP' }, 
        { status: 404 }
      );
    }

    // TODO: Update your database with the new karma GAP data
    // This will depend on your existing database setup
    // Example:
    // await updateProjectKarmaGAPData(projectId, karmaGAPProfile);

    return NextResponse.json({ 
      success: true, 
      data: karmaGAPProfile,
      message: 'Project data synced successfully' 
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync project data' }, 
      { status: 500 }
    );
  }
} 