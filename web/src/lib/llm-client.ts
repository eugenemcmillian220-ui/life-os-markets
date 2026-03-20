// LLM client with fallback strategy: Groq → Hugging Face → Gemini
export async function generateRecommendations(context: {
  marketEvent: string
  userGoals: string[]
  userTasks: string[]
  sentiment: string
}) {
  try {
    // Mock recommendation generation - will integrate with Groq API
    const recommendations = [
      {
        id: 1,
        type: 'task_update',
        title: 'Review Mortgage Refinance Timeline',
        reason: `Fed signal suggests refinancing window opening. Your goal to "optimize mortgage" aligns with current market.`,
        priority: 'high',
        tags: ['Fed-related', 'financial'],
      },
      {
        id: 2,
        type: 'goal_adjustment',
        title: 'Consider EUR Position Increase',
        reason: `ECB stimulus positive for EUR. Your "save €10k" goal could benefit from strong EUR environment.`,
        priority: 'medium',
        tags: ['ECB-related', 'currency'],
      },
    ]
    return { success: true, recommendations }
  } catch (error) {
    console.error('LLM error:', error)
    return { success: false, recommendations: [], error: String(error) }
  }
}

export async function analyzeSentiment(text: string): Promise<'bullish' | 'neutral' | 'bearish'> {
  const bullishWords = ['surge', 'rise', 'gain', 'boost', 'positive', 'strong', 'growth', 'rally', 'higher', 'stimulus']
  const bearishWords = ['fall', 'drop', 'decline', 'down', 'crash', 'negative', 'weak', 'loss', 'lower']

  const lower = text.toLowerCase()
  const bullishCount = bullishWords.filter(word => lower.includes(word)).length
  const bearishCount = bearishWords.filter(word => lower.includes(word)).length

  if (bullishCount > bearishCount) return 'bullish'
  if (bearishCount > bullishCount) return 'bearish'
  return 'neutral'
}
