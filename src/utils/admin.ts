// Must match `isAdmin()` in firestore.rules and storage.rules exactly.
// If you change one, change both — otherwise the UI will accept writes the
// database rejects (or, worse, the database will accept what the UI intended to block).
export const ADMIN_EMAIL = 'kpugazhmani21@gmail.com'

export const MFA_CLAIM = 'adminMfa'

export function isAdminEmail(email: string | null | undefined): boolean {
  return typeof email === 'string' && email.trim() === ADMIN_EMAIL
}
