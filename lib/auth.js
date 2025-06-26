import { cookies } from 'next/headers'

export function isAuthenticated() {
  const cookieStore = cookies()
  const session = cookieStore.get('admin-session')
  return session?.value === 'authenticated'
}

export async function checkAuth() {
  if (!isAuthenticated()) {
    return { redirect: '/admin/login' }
  }
  return { authenticated: true }
} 