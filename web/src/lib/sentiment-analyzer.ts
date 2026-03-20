const bullishWords = ['surge', 'rise', 'gain', 'up', 'boost', 'positive', 'strong', 'growth', 'rally', 'higher']
const bearishWords = ['fall', 'drop', 'decline', 'down', 'crash', 'negative', 'weak', 'loss', 'lower', 'sold']

export function analyzeSentiment(text: string): 'bullish' | 'neutral' | 'bearish' {
  const lower = text.toLowerCase()
  
  const bullishCount = bullishWords.filter(word => lower.includes(word)).length
  const bearishCount = bearishWords.filter(word => lower.includes(word)).length

  if (bullishCount > bearishCount) return 'bullish'
  if (bearishCount > bullishCount) return 'bearish'
  return 'neutral'
}
