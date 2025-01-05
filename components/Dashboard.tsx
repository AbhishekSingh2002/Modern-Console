'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { WeatherWidget } from './WeatherWidget'
import { NewsWidget } from './NewsWidget'
import { FinanceWidget } from './FinanceWidget'
import { WidgetSelector } from './WidgetSelector'
import { AnimatedBackground } from './AnimatedBackground'
import { Button } from './U_I/button'
import { Moon, Sun, ArrowLeft } from 'lucide-react'
import { useTheme } from 'next-themes'
import { GitHubWidget } from './GithubWidget'
import { MovieWidget } from './MovieWidget'
import clsx from 'clsx'

type WidgetType = 'weather' | 'news' | 'finance' | 'github' | 'movie' | null

export function Dashboard() {
  const [selectedWidget, setSelectedWidget] = useState<WidgetType>(null)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    })
  }, [controls])

  const renderWidget = () => {
    switch (selectedWidget) {
      case 'weather':
        return <WeatherWidget />
      case 'news':
        return <NewsWidget />
      case 'finance':
        return <FinanceWidget />
      case 'github':
        return <GitHubWidget />
      case 'movie':
        return <MovieWidget />
      default:
        return <WidgetSelector onSelect={setSelectedWidget} />
    }
  }

  return (
    <div className={`relative w-full min-h-screen overflow-hidden ${resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <AnimatedBackground />
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className={`w-full min-h-screen p-8 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.h1
              className={clsx("text-5xl text-transparent bg-clip-text bg-gradient-to-r font-bold",
                resolvedTheme === 'dark' ? 'from-purple-500 to-pink-500' : 'bg-purple-600'
              )}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Modern Console
            </motion.h1>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className={`border ${resolvedTheme === 'dark' ? 'border-white/30' : 'border-gray-300'} p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors duration-300`}
              >
                <Sun className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all ${resolvedTheme === 'dark' ? 'hidden' : ''}`} />
                <Moon className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all ${resolvedTheme === 'dark' ? 'block' : 'hidden'}`} />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedWidget || 'selector'}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md"
            >
              {renderWidget()}
            </motion.div>
          </AnimatePresence>

          {selectedWidget && (
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                onClick={() => setSelectedWidget(null)}
                className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Widget Selection
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
