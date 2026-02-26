const colors = {
  success: 'bg-green-100 border-green-400 text-green-800',
  error: 'bg-red-100 border-red-400 text-red-800',
};

export default function AlertModal({ message, type, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`border rounded-lg shadow-lg p-6 w-full max-w-sm ${colors[type]}`}>
        <p className="text-lg font-medium mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 rounded font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
}
