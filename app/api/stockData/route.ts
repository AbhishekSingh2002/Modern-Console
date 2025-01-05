import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const symbol = url.searchParams.get('symbol')

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
  }

  const apiKey = 'wjQQIec6hFai1Xhs73DN49WNZef5v3MawbpNIctj'  // Replace with your actual Yahoo API key

  try {
    console.log("into try block");
    
    // Make API requests with the API key in the headers
    const [quoteResponse, chartResponse] = await Promise.all([
      fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,  // Include API key in the Authorization header
        }
      }),
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,  // Include API key in the Authorization header
        }
      }),
    ])


    if (!quoteResponse.ok || !chartResponse.ok) {
      throw new Error('Failed to fetch stock data')
    }

    const quoteData = await quoteResponse.json()
    const chartData = await chartResponse.json()

    if (!quoteData.quoteResponse.result[0] || !chartData.chart.result[0]) {
      throw new Error('No data found')
    }

    const quote = quoteData.quoteResponse.result[0]
    const chart = chartData.chart.result[0]

    const historicalData = chart.timestamp.map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      price: chart.indicators.quote[0].close[index],
    }))

    return NextResponse.json({
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
      volume: quote.regularMarketVolume,
      historicalData,
    })
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 })
  }
}
