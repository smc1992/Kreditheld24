// Temporärer In-Memory Store für Demo-Zwecke
// In Produktion sollte eine echte Datenbank verwendet werden
const verificationStore = new Map<string, {
  email: string
  formData: Record<string, unknown>
  createdAt: Date
  verified: boolean
}>()

export function storeVerificationToken(
  token: string, 
  email: string, 
  formData: Record<string, unknown>
) {
  verificationStore.set(token, {
    email,
    formData,
    createdAt: new Date(),
    verified: false
  })
}

export function getVerificationData(token: string) {
  return verificationStore.get(token)
}

export function isTokenVerified(token: string): boolean {
  const data = verificationStore.get(token)
  return data?.verified || false
}

export function markTokenAsVerified(token: string): boolean {
  const data = verificationStore.get(token)
  if (data) {
    data.verified = true
    verificationStore.set(token, data)
    return true
  }
  return false
}