import { SkillAssessmentContent } from "../../../components/dashboard/Skill-assessment-content"
import { getSession } from "../../../lib/auth"


export default async function SkillAssessmentPage() {
  const session = await getSession()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">AI Skill Assessment</h1>
      <p className="text-muted-foreground mb-8">
        Get an AI-powered assessment of your skills and personalized recommendations for improvement.
      </p>
      {session ? (
        <SkillAssessmentContent userId={session.userId} />
      ) : (
        <p className="text-red-500">Session not found. Please log in.</p>
      )}
    </div>
  )
}
