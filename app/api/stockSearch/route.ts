
export async function GET(request: Request) {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
  
    if (!query) {
      return new Response('Query parameter "q" is required', { status: 400 })
    }
  
    try {
      const response = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${query}&lang=en-US&region=US&quotesCount=6&newsCount=0&listsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&enableCb=true&enableNavLinks=true&enableEnhancedTrivialQuery=true`)
      const data = await response.json()
  
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      return new Response('Failed to fetch suggestions', { status: 500 })
    }
  }
  