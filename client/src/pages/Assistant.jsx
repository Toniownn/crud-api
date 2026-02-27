import { useState } from 'react';
import { getAssistant } from '../api/assistant';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Assistant() {
  const [assistantId, setAssistantId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await getAssistant(assistantId);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch assistant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-black uppercase text-black mb-8">
        AI Assistant Lookup
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-[20px] border border-gray-200 p-6 mb-6 flex gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Assistant ID (e.g. asst_...)"
            value={assistantId}
            onChange={(e) => setAssistantId(e.target.value)}
            required
            className="w-full bg-[#F0F0F0] border-0 rounded-full pl-10 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {result && (
        <div className="bg-white rounded-[20px] border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-black mb-2">{result.name || 'Unnamed'}</h2>
          {result.description && (
            <p className="text-gray-600 mb-4">{result.description}</p>
          )}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <dt className="text-gray-500">ID</dt>
            <dd className="text-black font-mono">{result.id}</dd>
            <dt className="text-gray-500">Model</dt>
            <dd className="text-black">{result.model}</dd>
            <dt className="text-gray-500">Created</dt>
            <dd className="text-black">
              {new Date(result.created_at * 1000).toLocaleString()}
            </dd>
          </dl>

          <details className="mt-4">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Raw JSON
            </summary>
            <pre className="mt-2 bg-[#F0F0F0] rounded-[20px] p-3 text-xs overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
