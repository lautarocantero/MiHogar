let sessionKey: Buffer | null = null
let sessionSalt: Buffer | null = null

export function setSessionKey(key: Buffer, salt: Buffer): void {
  sessionKey = key
  sessionSalt = salt
}

export function getSessionKey(): Buffer | null {
  return sessionKey
}

export function getSessionSalt(): Buffer | null {
  return sessionSalt
}

export function clearSession(): void {
  sessionKey = null
  sessionSalt = null
}

export function isUnlocked(): boolean {
  return sessionKey !== null
}
