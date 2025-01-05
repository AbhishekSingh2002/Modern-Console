'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/U_I/card"
import { Button } from "@/components/U_I/button"
import { AnimatedNumber } from './U_I/animated-number'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import axios from 'axios'
import { StockSearch } from './StockSearch'

const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  volume: number
  historicalData: { date: string; price: number }[]
}

export function FinanceWidget() {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [timeRange, setTimeRange] = useState('1M')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchStockData = async (symbol: string) => {
    setLoading(true)
    setError('')
    try {
      const quoteResponse = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      })

      const timeSeries = quoteResponse.data['Time Series (Daily)'] ?? {}
      const dates = Object.keys(timeSeries)

      const historicalData = dates.map((date) => ({
        date,
        price: parseFloat(timeSeries[date]['4. close']),
      }))

      const latestData = timeSeries[dates[0]]
      setStockData({
        symbol,
        price: parseFloat(latestData['4. close']),
        change: parseFloat(latestData['4. close']) - parseFloat(latestData['1. open']),
        changePercent: ((parseFloat(latestData['4. close']) - parseFloat(latestData['1. open'])) / parseFloat(latestData['1. open'])) * 100,
        high: parseFloat(latestData['2. high']),
        low: parseFloat(latestData['3. low']),
        open: parseFloat(latestData['1. open']),
        previousClose: parseFloat(latestData['4. close']),
        volume: parseInt(latestData['5. volume']),
        historicalData,
      })
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getTimeRangeData = () => {
    if (!stockData) return []
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '1W':
        startDate.setDate(now.getDate() - 7)
        break
      case '1M':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3M':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6M':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'ALL':
        return stockData.historicalData
    }

    return stockData.historicalData.filter(item => new Date(item.date) >= startDate)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Card className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold">
            <DollarSign className="mr-2 text-blue-500 dark:text-blue-400" />
            Stock Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StockSearch onSubmit={fetchStockData} isLoading={loading} />

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

          {stockData && !loading && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold">{stockData.symbol}</h3>
              <div className="flex items-center text-lg">
                <DollarSign className="mr-2 text-blue-500 dark:text-blue-400" />
                <AnimatedNumber value={stockData?.price ?? 0} />
              </div>
              <div className="flex items-center text-sm">
                {stockData.change >= 0 ? (
                  <TrendingUp className="mr-2 text-green-500" />
                ) : (
                  <TrendingDown className="mr-2 text-red-500" />
                )}
                <AnimatedNumber value={stockData?.change ?? 0} />
                (<AnimatedNumber value={stockData?.changePercent ?? 0} />%)
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Open: ${stockData?.open?.toFixed(2) ?? 'N/A'}</div>
                <div>Previous Close: ${stockData?.previousClose?.toFixed(2) ?? 'N/A'}</div>
                <div>High: ${stockData?.high?.toFixed(2) ?? 'N/A'}</div>
                <div>Low: ${stockData?.low?.toFixed(2) ?? 'N/A'}</div>
                <div>Volume: {stockData?.volume?.toLocaleString() ?? 'N/A'}</div>
              </div>
              <div className="flex space-x-2">
                {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
                  <Button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    variant={timeRange === range ? 'default' : 'outline'}
                    size="sm"
                  >
                    {range}
                  </Button>
                ))}
              </div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getTimeRangeData()}>
                    <XAxis
                      dataKey="date"
                      stroke="currentColor"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis
                      stroke="currentColor"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--popover-foreground))',
                      }}
                      labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <ReferenceLine y={stockData?.previousClose ?? 0} stroke="gray" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
