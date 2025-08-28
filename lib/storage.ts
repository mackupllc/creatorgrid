/**
 * Safe localStorage utilities that handle SSR gracefully
 */

/**
 * Safely get a value from localStorage with fallback
 * @param key - The localStorage key
 * @param fallback - The fallback value if key doesn't exist or SSR
 * @returns The parsed value from localStorage or the fallback
 */
export function getLocal<T>(key: string, fallback: T): T {
  // Return fallback during SSR (window is undefined)
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const item = window.localStorage.getItem(key)
    if (item === null) {
      return fallback
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return fallback
  }
}

/**
 * Safely set a value in localStorage
 * @param key - The localStorage key
 * @param value - The value to store (will be JSON stringified)
 */
export function setLocal<T>(key: string, value: T): void {
  // No-op during SSR (window is undefined)
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error)
  }
}

/**
 * Safely remove a value from localStorage
 * @param key - The localStorage key to remove
 */
export function removeLocal(key: string): void {
  // No-op during SSR (window is undefined)
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
  }
}