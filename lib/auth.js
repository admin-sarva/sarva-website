import { cookies } from 'next/headers'

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')
  return session?.value === 'authenticated'
}

export async function checkAuth() {
  if (!(await isAuthenticated())) {
    return { redirect: '/admin/login' }
  }
  return { authenticated: true }
} 
