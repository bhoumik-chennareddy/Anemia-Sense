'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export default function AuthButton() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false once user data is loaded
    setLoading(false);
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  if (loading) {
    return <div className="h-10"></div>; // Return empty div with same height as buttons
  }

  return user ? (
    <div className="flex items-center gap-4 text-white">
      <span>Welcome, {user.email}</span>
      <Button onClick={handleSignOut} variant="outline">
        Sign out
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Button asChild variant="outline">
        <a href="/login">Login</a>
      </Button>
      <Button asChild>
        <a href="/signup">Sign up</a>
      </Button>
    </div>
  );
}
