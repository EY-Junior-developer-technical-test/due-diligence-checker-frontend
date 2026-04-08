import type { AuthSession } from '../model/auth'

const AUTH_TOKEN_KEY = 'ddc.auth.token'
const AUTH_SESSION_KEY = 'ddc.auth.session'

export function setAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
  localStorage.setItem(AUTH_TOKEN_KEY, session.token)
}

export function getAuthSession(): AuthSession | null {
  const rawSession = localStorage.getItem(AUTH_SESSION_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as AuthSession
  } catch {
    localStorage.removeItem(AUTH_SESSION_KEY)
    return null
  }
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}
