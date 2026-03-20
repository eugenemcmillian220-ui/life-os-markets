// Mock market data client with fallback strategy
export async function fetchMarketNews() {
  try {
    // Mock data for MVP - will integrate with real MarketAux API
    const news = [
      {
        id: 1,
        title: 'Federal Reserve Signals Rate Hold',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        sentiment: 'neutral',
        impact: 'high',
        source: 'MarketAux',
        tags: ['Fed', 'Rates', 'US'],
      },
      {
        id: 2,
        title: 'ECB Announces Stimulus Package',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        sentiment: 'bullish',
        impact: 'high',
        source: 'MarketAux',
        tags: ['ECB', 'EU', 'Stimulus'],
      },
      {
        id: 3,
        title: 'EUR/USD Breaks Key Support Level',
        timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
        sentiment: 'bearish',
        impact: 'medium',
        source: 'MarketAux',
        tags: ['Forex', 'EUR', 'Trading'],
      },
    ]
    return { success: true, data: news }
  } catch (error) {
    console.error('Market fetch error:', error)
    return { success: false, data: [], error: String(error) }
  }
}

export async function fetchStockPrices(symbols: string[]) {
  try {
    // Mock price data - will integrate with Alpha Vantage API
    const prices = symbols.map(symbol => ({
      symbol,
      price: Math.random() * 1000,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      timestamp: new Date().toISOString(),
    }))
    return { success: true, data: prices }
  } catch (error) {
    console.error('Price fetch error:', error)
    return { success: false, data: [], error: String(error) }
  }
}
