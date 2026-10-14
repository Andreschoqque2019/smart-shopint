// Registers the jest-dom matchers (`toBeInTheDocument`, and friends) on
// Vitest's `expect` for every test file.
import '@testing-library/jest-dom/vitest'

// Vitest runs without global test APIs, so Testing Library's automatic
// cleanup is not enabled. Unmount every rendered tree after each test to keep
// the jsdom document isolated.
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
