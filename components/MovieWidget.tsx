'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/U_I/card"
import { Input } from "@/components/U_I/input"
import { Button } from "@/components/U_I/button"
import { ScrollArea } from "@/components/U_I/scroll-area"
import { Film, Search, Star, TrendingUp } from 'lucide-react'
import axios from 'axios'
import { debounce } from 'lodash'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  overview: string
}

export function MovieWidget() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [autocompleteResults, setAutocompleteResults] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const autocompleteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTrendingMovies()
  }, [])

  const fetchTrendingMovies = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${TMDB_API_BASE_URL}/trending/movie/week`, {
        params: { api_key: TMDB_API_KEY }
      })
      setTrendingMovies(response.data.results)
    } catch (err) {
      setError('Failed to fetch trending movies')
    } finally {
      setLoading(false)
    }
  }

  const renderMovieList = (movies: Movie[], title: string) => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
            >
              <img
                src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '/placeholder.svg?height=300&width=200'}
                alt={movie.title}
                className="w-full h-auto rounded-md shadow-md"
              />
              <p className="text-sm mt-1 text-center truncate">{movie.title}</p>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <Film className="mr-2 text-primary" />
            Movie Explorer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          <AnimatePresence mode="wait">
            {selectedMovie ? (
              <motion.div
                key="movie-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4"
              >
                <Button
                  variant="outline"
                  onClick={() => setSelectedMovie(null)}
                  className="mb-4"
                >
                  Back to list
                </Button>
                <div className="flex flex-col md:flex-row">
                  <img
                    src={selectedMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${selectedMovie.poster_path}` : '/placeholder.svg'}
                    alt={selectedMovie.title}
                    className="w-full md:w-1/3 rounded-md shadow-md mb-4 md:mb-0 md:mr-4"
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedMovie.title}</h2>
                    <p className="text-muted-foreground mb-2">
                      Release Date: {new Date(selectedMovie.release_date).toLocaleDateString()}
                    </p>
                    <div className="flex items-center mb-2">
                      <Star className="text-yellow-400 mr-1" />
                      <span>{selectedMovie.vote_average.toFixed(1)} / 10</span>
                    </div>
                    <p>{selectedMovie.overview}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="movie-lists"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                {renderMovieList(trendingMovies, 'Trending Movies')}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
