'use client';

import { Brain } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function AIExplanation() {
  return (
    <Alert className="mb-6">
      <Brain className="h-4 w-4" />
      <AlertTitle>AI-Powered Skill Matching</AlertTitle>
      <AlertDescription>
        Our AI uses Hugging Face&apos;s sentence-transformers/all-MiniLM-L6-v2
        model to analyze your skills and needs, comparing them with other users
        to find the best matches. The matching score is calculated using cosine
        similarity between text embeddings, providing more accurate and
        meaningful connections.
      </AlertDescription>
    </Alert>
  );
}
