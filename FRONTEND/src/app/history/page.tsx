import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HistoryPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: results, error } = await supabase
    .from('results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching results:', error);
    // You might want to show an error message to the user here
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Test History</h1>
            <Link href="/" className="py-2 px-4 rounded-md no-underline bg-blue-600 hover:bg-blue-700 transition">
                Back to Home
            </Link>
        </div>

        {results && results.length > 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Test Type</th>
                  <th className="p-4">Your Input</th>
                  <th className="p-4">Result</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="p-4">{new Date(result.created_at).toLocaleDateString()}</td>
                    <td className="p-4 capitalize">{result.test_type}</td>
                    <td className="p-4 font-mono text-sm break-all">{result.input_data}</td>
                    <td className="p-4 font-semibold">{result.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <p className="text-xl text-gray-400">You have no test history yet.</p>
            <p className="mt-4">Complete a test to see your results here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
