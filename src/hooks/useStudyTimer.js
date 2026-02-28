import { useCallback, useEffect, useState } from 'react'

export const useStudyTimer = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return undefined

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((previousSeconds) => previousSeconds + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(() => {
    setIsRunning(false)
    setElapsedSeconds(0)
  }, [])

  return {
    elapsedSeconds,
    isRunning,
    start,
    pause,
    reset,
  }
}
