import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options } as any)
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be safely ignored.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options } as any)
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be safely ignored.
          }
        },
      },
    }
  )
}

export async function getSession() {
  const supabase = createClient()
  return await supabase.auth.getSession()
}

export async function getUser() {
  const supabase = createClient()
  return await supabase.auth.getUser()
}