'use server';

import { createClient } from '@/utils/supabase/server';

interface ResultData {
  test_type: 'visual' | 'cbc';
  input_data: string;
  result: string;
}

export async function saveResult(data: ResultData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // This should ideally not happen if called from a logged-in state,
    // but it's a good safeguard.
    console.log('No user found, not saving result.');
    return;
  }

  const { error } = await supabase.from('results').insert({
    user_id: user.id,
    test_type: data.test_type,
    input_data: data.input_data,
    result: data.result,
  });

  if (error) {
    console.error('Error saving result to database:', error);
    // We are not returning the error to the client to avoid exposing DB details.
    // We just log it on the server.
  }
}
