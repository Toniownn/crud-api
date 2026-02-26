import { useState } from 'react';
import { getAssistant } from '../api/assistant';

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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">AI Assistant Lookup</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Enter Assistant ID (e.g. asst_...)"
          value={assistantId}
          onChange={(e) => setAssistantId(e.target.value)}
          required
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded font-medium"
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {result && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{result.name || 'Unnamed'}</h2>
          {result.description && (
            <p className="text-gray-600 mb-3">{result.description}</p>
          )}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-500">ID</dt>
            <dd className="text-gray-800 font-mono">{result.id}</dd>
            <dt className="text-gray-500">Model</dt>
            <dd className="text-gray-800">{result.model}</dd>
            <dt className="text-gray-500">Created</dt>
            <dd className="text-gray-800">
              {new Date(result.created_at * 1000).toLocaleString()}
            </dd>
          </dl>

          <details className="mt-4">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Raw JSON
            </summary>
            <pre className="mt-2 bg-gray-50 rounded p-3 text-xs overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
