import { readFileSync } from 'node:fs'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'

const ADMIN = 'kpugazhmani21@gmail.com'
const RULES = readFileSync(new URL('./firestore.rules', import.meta.url), 'utf8')

const env = await initializeTestEnvironment({
  projectId: 'learnwithpugazh-4182d',
  firestore: { rules: RULES, host: '127.0.0.1', port: 8080 },
})

await env.clearFirestore()

let passed = 0
let failed = 0

async function check(label, mode, op) {
  let outcome
  try {
    await op()
    outcome = 'allowed'
  } catch {
    outcome = 'denied'
  }
  const ok = (mode === 'allow' && outcome === 'allowed') || (mode === 'deny' && outcome === 'denied')
  if (ok) passed++
  else failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  want=${mode.padEnd(5)} got=${outcome.padEnd(7)} ${label}`)
}

const anon = env.unauthenticatedContext()
const passwordOnlyAdmin = env.authenticatedContext('admin-uid', { email: ADMIN })
const verifiedAdmin = env.authenticatedContext('admin-uid', { email: ADMIN, adminMfa: true })
const strangerWithClaim = env.authenticatedContext('stranger-uid', {
  email: 'attacker@example.com',
  adminMfa: true,
})
const stranger = env.authenticatedContext('stranger-uid', { email: 'attacker@example.com' })

const blogOf = (ctx) => doc(ctx.firestore(), 'blogPosts/probe')
const otpOf = (ctx) => doc(ctx.firestore(), 'otps/admin-uid')

console.log('\n-- public read surface --')
await check('anon reads blogPosts', 'allow', () => getDoc(blogOf(anon)))
await check('anon reads learningTopics', 'allow', () => getDoc(doc(anon.firestore(), 'learningTopics/probe')))
await check('stranger reads blogPosts', 'allow', () => getDoc(blogOf(stranger)))

console.log('\n-- the attack this change exists to stop --')
await check('anon writes blogPosts', 'deny', () => setDoc(blogOf(anon), { title: 'defaced' }))
await check('anon deletes blogPosts', 'deny', () => deleteDoc(blogOf(anon)))
await check('stranger writes blogPosts', 'deny', () => setDoc(blogOf(stranger), { title: 'defaced' }))
await check('admin with PASSWORD ONLY writes blogPosts', 'deny', () =>
  setDoc(blogOf(passwordOnlyAdmin), { title: 'defaced' }),
)
await check('admin with PASSWORD ONLY deletes blogPosts', 'deny', () => deleteDoc(blogOf(passwordOnlyAdmin)))
await check('admin with PASSWORD ONLY writes learningTopics', 'deny', () =>
  setDoc(doc(passwordOnlyAdmin.firestore(), 'learningTopics/probe'), { title: 'x' }),
)
await check('admin with PASSWORD ONLY writes otpRate', 'deny', () =>
  setDoc(doc(passwordOnlyAdmin.firestore(), 'otpRate/admin-uid'), { sends: 999 }),
)

console.log('\n-- positive path: password + verified OTP claim --')
await check('admin + adminMfa writes blogPosts', 'allow', () =>
  setDoc(blogOf(verifiedAdmin), { title: 'legit', tags: [], content: [] }),
)
await check('admin + adminMfa updates blogPosts', 'allow', () => setDoc(blogOf(verifiedAdmin), { title: 'updated' }))
await check('admin + adminMfa deletes blogPosts', 'allow', () => deleteDoc(blogOf(verifiedAdmin)))
await check('admin + adminMfa writes learningTopics', 'allow', () =>
  setDoc(doc(verifiedAdmin.firestore(), 'learningTopics/probe'), { title: 'y' }),
)

console.log('\n-- claim alone is not enough (email must match too) --')
await check('stranger + adminMfa writes blogPosts', 'deny', () =>
  setDoc(blogOf(strangerWithClaim), { title: 'nope' }),
)

console.log('\n-- OTP collection is server-only, even for a verified admin --')
await check('anon reads otps', 'deny', () => getDoc(otpOf(anon)))
await check('anon writes otps', 'deny', () => setDoc(otpOf(anon), { codeHash: 'x' }))
await check('admin + adminMfa reads otps', 'deny', () => getDoc(otpOf(verifiedAdmin)))
await check('admin + adminMfa writes otps', 'deny', () => setDoc(otpOf(verifiedAdmin), { codeHash: 'x' }))
await check('password-only admin reads otps', 'deny', () => getDoc(otpOf(passwordOnlyAdmin)))
await check('anon reads otpRate', 'deny', () => getDoc(doc(anon.firestore(), 'otpRate/admin-uid')))
await check('admin + adminMfa reads otpRate', 'deny', () =>
  getDoc(doc(verifiedAdmin.firestore(), 'otpRate/admin-uid')),
)

console.log('\n-- deny by default for anything else --')
await check('admin + adminMfa writes an unknown collection', 'deny', () =>
  setDoc(doc(verifiedAdmin.firestore(), 'users/anything'), { role: 'superadmin' }),
)
await check('anon reads an unknown collection', 'deny', () => getDoc(doc(anon.firestore(), 'users/anything')))

await env.clearFirestore()
await env.cleanup()

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
