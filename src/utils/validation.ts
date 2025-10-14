export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function isValidLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max
}

