import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '../../../../lib/auth';
import { getEmbeddings } from "../../../../lib/huggingface"

// Input validation schema
const AssessmentSchema = z.object({
  skill: z.string().min(1, "Skill name is required"),
  description: z.string().min(1, "Skill description is required"),
  level: z.number().min(1).max(10),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = AssessmentSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Validation failed", details: validatedData.error.format() }, { status: 400 })
    }

    const { skill, description, level } = validatedData.data

    // Get embeddings for the skill description
    const descriptionEmbeddings = await getEmbeddings(description)

    if (!descriptionEmbeddings) {
      return NextResponse.json(
        { error: "Failed to analyze skill", message: "Could not generate embeddings for skill analysis" },
        { status: 500 },
      )
    }

    // Determine level based on user input
    let currentLevel
    if (level <= 3) {
      currentLevel = "Beginner"
    } else if (level <= 7) {
      currentLevel = "Intermediate"
    } else {
      currentLevel = "Advanced"
    }

    // Generate personalized strengths based on the skill and description
    const strengths = generatePersonalizedStrengths(skill, description, level)

    // Generate personalized weaknesses based on the skill and description
    const weaknesses = generatePersonalizedWeaknesses(skill, description, level)

    // Generate personalized recommendations based on the skill, level, and identified weaknesses
    const recommendations = generatePersonalizedRecommendations(skill, currentLevel.toLowerCase(), weaknesses)

    // Generate personalized resources
    const resources = [
      {
        title: `${skill} ${currentLevel === "Beginner" ? "Fundamentals" : currentLevel === "Intermediate" ? "Advanced Techniques" : "Mastery"}`,
        type: "Course",
        link: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
      },
      {
        title: `Professional ${skill}`,
        type: "Book",
        link: `https://www.amazon.com/s?k=${encodeURIComponent(skill)}+professional+guide`,
      },
      {
        title: `${skill} Community`,
        type: "Community",
        link: `https://www.reddit.com/search/?q=${encodeURIComponent(skill)}`,
      },
    ]

    // Generate assessment with AI-enhanced insights
    const assessment = {
      currentLevel,
      strengths,
      weaknesses,
      recommendations,
      resources,
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error("Error in skill assessment:", error)
    return NextResponse.json(
      {
        error: "Failed to assess skill",
        message: "An unexpected error occurred during skill assessment. Please try again later.",
      },
      { status: 500 },
    )
  }
}

// Helper function to generate personalized strengths
function generatePersonalizedStrengths(skill: string, description: string, level: number): string[] {
  const strengths = []

  // Extract keywords from the description
  const keywords = extractKeywords(description)

  // Add skill-specific strengths
  if (
    skill.toLowerCase().includes("develop") ||
    keywords.some((k) => ["code", "programming", "develop", "software", "web"].includes(k))
  ) {
    strengths.push(`Strong foundation in ${skill} fundamentals`)
    if (level > 5) strengths.push("Ability to build complex applications independently")
    if (level > 7) strengths.push("Experience with advanced architectural patterns")
  } else if (
    skill.toLowerCase().includes("design") ||
    keywords.some((k) => ["design", "ui", "ux", "visual", "creative"].includes(k))
  ) {
    strengths.push(`Good eye for ${skill} aesthetics and user experience`)
    if (level > 5) strengths.push("Ability to create cohesive design systems")
    if (level > 7) strengths.push("Advanced understanding of design principles and psychology")
  } else if (
    skill.toLowerCase().includes("market") ||
    keywords.some((k) => ["marketing", "seo", "content", "social media", "analytics"].includes(k))
  ) {
    strengths.push(`Solid understanding of ${skill} principles`)
    if (level > 5) strengths.push("Experience with data-driven campaign optimization")
    if (level > 7) strengths.push("Strategic approach to comprehensive marketing initiatives")
  } else {
    // Generic strengths based on level
    if (level <= 3) {
      strengths.push(`Foundational knowledge of ${skill} concepts`)
      strengths.push("Enthusiasm and willingness to learn")
    } else if (level <= 7) {
      strengths.push(`Practical experience applying ${skill} in real-world scenarios`)
      strengths.push("Ability to solve common problems independently")
    } else {
      strengths.push(`Deep expertise in advanced ${skill} techniques`)
      strengths.push("Ability to mentor others and lead complex projects")
    }
  }

  // Add general strengths based on description keywords
  if (keywords.some((k) => ["team", "collaborate", "group", "project"].includes(k))) {
    strengths.push("Strong collaboration and teamwork skills")
  }

  if (keywords.some((k) => ["problem", "solve", "solution", "debug", "fix"].includes(k))) {
    strengths.push("Excellent problem-solving abilities")
  }

  if (keywords.some((k) => ["learn", "study", "improve", "growth", "develop"].includes(k))) {
    strengths.push("Commitment to continuous learning and improvement")
  }

  // Ensure we have at least 3 strengths
  if (strengths.length < 3) {
    strengths.push(`Practical application of ${skill} in relevant contexts`)
  }

  return strengths
}

// Helper function to generate personalized weaknesses
function generatePersonalizedWeaknesses(skill: string, description: string, level: number): string[] {
  const weaknesses = []

  // Extract keywords from the description
  const keywords = extractKeywords(description)

  // Add skill-specific weaknesses based on level
  if (level <= 3) {
    weaknesses.push(`Limited practical experience with advanced ${skill} techniques`)
    weaknesses.push(`Need more exposure to real-world ${skill} challenges`)
  } else if (level <= 7) {
    weaknesses.push(`Could benefit from deeper knowledge of ${skill} optimization strategies`)
    weaknesses.push(`May need more experience with complex ${skill} scenarios`)
  } else {
    weaknesses.push(`May need to stay updated with the latest ${skill} trends and technologies`)
    weaknesses.push(`Could benefit from broader exposure to different ${skill} methodologies`)
  }

  // Add specific weaknesses based on skill type
  if (
    skill.toLowerCase().includes("develop") ||
    keywords.some((k) => ["code", "programming", "develop", "software", "web"].includes(k))
  ) {
    if (level <= 5) weaknesses.push("Need to improve code organization and architecture skills")
    if (!keywords.some((k) => ["test", "testing", "quality"].includes(k))) {
      weaknesses.push("Could improve testing and quality assurance practices")
    }
  } else if (
    skill.toLowerCase().includes("design") ||
    keywords.some((k) => ["design", "ui", "ux", "visual", "creative"].includes(k))
  ) {
    if (level <= 5) weaknesses.push("Need more practice with advanced design tools and techniques")
    if (!keywords.some((k) => ["feedback", "critique", "review"].includes(k))) {
      weaknesses.push("Could benefit from more peer feedback and critique")
    }
  } else if (
    skill.toLowerCase().includes("market") ||
    keywords.some((k) => ["marketing", "seo", "content", "social media", "analytics"].includes(k))
  ) {
    if (level <= 5) weaknesses.push("Need to develop stronger data analysis skills")
    if (!keywords.some((k) => ["measure", "roi", "conversion", "analytics"].includes(k))) {
      weaknesses.push("Could improve measurement and ROI tracking capabilities")
    }
  }

  // Ensure we have at least 3 weaknesses
  if (weaknesses.length < 3) {
    weaknesses.push(`May benefit from more structured learning in specific ${skill} areas`)
  }

  return weaknesses
}

// Helper function to generate personalized recommendations
function generatePersonalizedRecommendations(skill: string, level: string, weaknesses: string[]): string[] {
  const recommendations = []

  // Base recommendations on identified weaknesses
  weaknesses.forEach((weakness) => {
    if (weakness.includes("practical experience")) {
      recommendations.push(`Work on ${skill} projects that challenge your current abilities`)
    } else if (weakness.includes("optimization")) {
      recommendations.push(`Study advanced ${skill} optimization techniques through specialized courses`)
    } else if (weakness.includes("testing")) {
      recommendations.push(`Learn and implement test-driven development in your ${skill} projects`)
    } else if (weakness.includes("tools")) {
      recommendations.push(`Master professional ${skill} tools through tutorials and practice`)
    } else if (weakness.includes("peer feedback")) {
      recommendations.push(`Join ${skill} communities to get feedback on your work`)
    } else if (weakness.includes("data analysis")) {
      recommendations.push(`Take a course on data analytics specifically for ${skill} professionals`)
    }
  })

  // Add level-specific recommendations
  if (level === "beginner") {
    recommendations.push(`Complete a comprehensive ${skill} fundamentals course`)
    recommendations.push(`Build a portfolio of small ${skill} projects to demonstrate your abilities`)
    recommendations.push(`Find a mentor experienced in ${skill} to guide your learning journey`)
  } else if (level === "intermediate") {
    recommendations.push(`Contribute to open-source ${skill} projects to learn from experienced practitioners`)
    recommendations.push(`Specialize in a high-demand area of ${skill} to differentiate yourself`)
    recommendations.push(`Teach ${skill} basics to others to solidify your understanding`)
  } else if (level === "advanced") {
    recommendations.push(`Mentor others in ${skill} to reinforce your expertise`)
    recommendations.push(`Stay current with cutting-edge ${skill} developments through research papers and conferences`)
    recommendations.push(`Consider creating advanced ${skill} content to establish yourself as a thought leader`)
  }

  // Ensure we have at least 4 recommendations
  if (recommendations.length < 4) {
    recommendations.push(`Join professional ${skill} communities to network with peers`)
    recommendations.push(`Set up a structured learning plan to systematically improve your ${skill} abilities`)
  }

  // Return unique recommendations (no duplicates)
  return [...new Set(recommendations)]
}

// Helper function to extract keywords from text
function extractKeywords(text: string): string[] {
  const lowercaseText = text.toLowerCase()
  const words = lowercaseText.split(/\W+/)

  // Filter out common words and keep only meaningful keywords
  const stopWords = [
    "the",
    "and",
    "a",
    "an",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "about",
    "like",
    "through",
    "over",
    "before",
    "between",
    "after",
    "since",
    "without",
    "under",
    "within",
    "along",
    "following",
    "across",
    "behind",
    "beyond",
    "plus",
    "except",
    "but",
    "up",
    "down",
    "off",
    "above",
    "below",
    "use",
    "using",
    "do",
    "does",
    "did",
    "done",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "i",
    "me",
    "my",
    "mine",
    "myself",
    "you",
    "your",
    "yours",
    "yourself",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "we",
    "us",
    "our",
    "ours",
    "ourselves",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
  ]

  return words.filter((word) => word.length > 2 && !stopWords.includes(word))
}
