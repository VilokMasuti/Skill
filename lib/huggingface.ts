import { HfInference } from "@huggingface/inference"

// Initialize the Hugging Face inference client with a free API key
// Note: For production, this should be an environment variable
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || "")

// Using the free sentence-transformers model for text embeddings
const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

/**
 * Get embeddings for a text using Hugging Face
 * @param text Text to get embeddings for
 * @returns Array of embeddings or null if there's an error
 */
export async function getEmbeddings(text: string): Promise<number[] | null> {
  try {
    const response = await hf.featureExtraction({
      model: EMBEDDING_MODEL,
      inputs: text,
    })

    return Array.isArray(response[0]) ? (response[0] as number[]) : (response as number[])
  } catch (error) {
    console.error("Error getting embeddings:", error)
    return null
  }
}

/**
 * Calculate cosine similarity between two vectors
 * @param a First vector
 * @param b Second vector
 * @returns Similarity score between 0 and 1
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length")
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}

/**
 * Calculate skill match score using AI embeddings
 * @param userSkills User's skills
 * @param userNeeds User's needs
 * @param otherSkills Other user's skills
 * @param otherNeeds Other user's needs
 * @returns Match score between 0 and 100
 */
export async function calculateAISkillMatch(
  userSkills: string[],
  userNeeds: string[],
  otherSkills: string[],
  otherNeeds: string[],
): Promise<number> {
  try {
    // Combine skills and needs into single strings
    const userSkillsText = userSkills.join(", ")
    const userNeedsText = userNeeds.join(", ")
    const otherSkillsText = otherSkills.join(", ")
    const otherNeedsText = otherNeeds.join(", ")

    // Get embeddings
    const userSkillsEmbedding = await getEmbeddings(userSkillsText)
    const userNeedsEmbedding = await getEmbeddings(userNeedsText)
    const otherSkillsEmbedding = await getEmbeddings(otherSkillsText)
    const otherNeedsEmbedding = await getEmbeddings(otherNeedsText)

    // If any embeddings failed, fall back to simple matching
    if (!userSkillsEmbedding || !userNeedsEmbedding || !otherSkillsEmbedding || !otherNeedsEmbedding) {
      return calculateSimpleMatch(userSkills, userNeeds, otherSkills, otherNeeds)
    }

    // Calculate similarity between user needs and other skills
    const needsMatchScore = cosineSimilarity(userNeedsEmbedding, otherSkillsEmbedding)

    // Calculate similarity between user skills and other needs
    const skillsMatchScore = cosineSimilarity(userSkillsEmbedding, otherNeedsEmbedding)

    // Average the scores and convert to percentage
    const matchScore = ((needsMatchScore + skillsMatchScore) / 2) * 100

    return Math.round(matchScore)
  } catch (error) {
    console.error("Error in AI skill matching:", error)
    // Fall back to simple matching algorithm
    return calculateSimpleMatch(userSkills, userNeeds, otherSkills, otherNeeds)
  }
}

/**
 * Simple skill matching algorithm as fallback
 * @param userSkills User's skills
 * @param userNeeds User's needs
 * @param otherSkills Other user's skills
 * @param otherNeeds Other user's needs
 * @returns Match score between 0 and 100
 */
export function calculateSimpleMatch(
  userSkills: string[],
  userNeeds: string[],
  otherSkills: string[],
  otherNeeds: string[],
): number {
  // Count how many of the user's needs match the other user's skills
  const needsMatched = userNeeds.filter((need) =>
    otherSkills.some((skill) => skill.toLowerCase().includes(need.toLowerCase())),
  ).length

  // Count how many of the user's skills match the other user's needs
  const skillsMatched = userSkills.filter((skill) =>
    otherNeeds.some((need) => need.toLowerCase().includes(skill.toLowerCase())),
  ).length

  // Calculate match percentage (0-100)
  const totalNeeds = userNeeds.length
  const totalSkills = userSkills.length

  if (totalNeeds === 0 || totalSkills === 0) return 0

  const needsMatchPercentage = totalNeeds > 0 ? (needsMatched / totalNeeds) * 100 : 0
  const skillsMatchPercentage = totalSkills > 0 ? (skillsMatched / totalSkills) * 100 : 0

  // Average the two percentages
  return Math.round((needsMatchPercentage + skillsMatchPercentage) / 2)
}
