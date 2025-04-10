/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '../../../../lib/auth';
import { calculateAISkillMatch } from '../../../../lib/huggingface';
import { Skill } from '../../../../lib/models/skill';
import { User } from '../../../../lib/models/user';
import { connectToDatabase } from '../../../../lib/mongodb';

// Input validation schema
const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  minScore: z.coerce.number().min(0).max(100).optional().default(0),
});

export async function GET(request: NextRequest) {
  try {
    // Validate session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate query parameters
    const url = new URL(request.url);
    const validatedQuery = QuerySchema.safeParse({
      limit: url.searchParams.get('limit'),
      minScore: url.searchParams.get('minScore'),
    });

    if (!validatedQuery.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validatedQuery.error.format(),
        },
        { status: 400 }
      );
    }

    const { limit, minScore } = validatedQuery.data;

    // Connect to database
    await connectToDatabase();

    // Get the current user
    const currentUser = await User.findById(session.userId);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the user's skills
    const userSkills = await Skill.find({ user: session.userId });
    const userSkillTitles = userSkills.map((skill) => skill.title);
    const userNeeds = currentUser.needs || [];

    // Validate that user has skills or needs
    if (userSkillTitles.length === 0 && userNeeds.length === 0) {
      return NextResponse.json(
        {
          error: 'Profile incomplete',
          message:
            'Please add some skills or needs to your profile to find matches',
        },
        { status: 400 }
      );
    }

    // Get all other users
    const otherUsers = await User.find({ _id: { $ne: session.userId } });

    // Get all skills from other users
    const allOtherSkills = await Skill.find({
      user: { $in: otherUsers.map((user) => user._id) },
    }).populate('user', 'name image email github phone');

    // Group skills by user
    const skillsByUser: Record<
      string,
      { user: any; skills: any[]; needs: any[] }
    > = {};
    allOtherSkills.forEach((skill) => {
      if (!skillsByUser[skill.user._id]) {
        skillsByUser[skill.user._id] = {
          user: skill.user,
          skills: [],
          needs:
            otherUsers.find(
              (u) => u._id.toString() === skill.user._id.toString()
            )?.needs || [],
        };
      }
      skillsByUser[skill.user._id].skills.push(skill);
    });

    // Calculate match scores using AI
    const matchPromises = Object.values(skillsByUser).map(
      async (userData: any) => {
        const otherSkillTitles = userData.skills.map(
          (skill: { title: any }) => skill.title
        );

        // Use AI-powered matching with fallback to simple matching
        const matchScore = await calculateAISkillMatch(
          userSkillTitles,
          userNeeds,
          otherSkillTitles,
          userData.needs
        );

        return {
          user: userData.user,
          skills: userData.skills,
          needs: userData.needs,
          matchScore,
        };
      }
    );

    // Wait for all match calculations to complete
    const matches = await Promise.all(matchPromises);

    // Filter by minimum score and sort by match score (highest first)
    const filteredMatches = matches
      .filter((match) => match.matchScore >= minScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return NextResponse.json(filteredMatches);
  } catch (error) {
    console.error('Error finding skill matches:', error);
    return NextResponse.json(
      {
        error: 'Failed to find skill matches',
        message:
          'An unexpected error occurred while finding matches. Please try again later.',
      },
      { status: 500 }
    );
  }
}
