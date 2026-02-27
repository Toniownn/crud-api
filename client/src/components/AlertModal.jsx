import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const config = {
  success: {
    icon: CheckCircleIcon,
    iconColor: 'text-green-500',
  },
  error: {
    icon: XCircleIcon,
    iconColor: 'text-red-500',
  },
};

export default function AlertModal({ message, type, onClose }) {
  const { icon: Icon, iconColor } = config[type] || config.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-xl border border-gray-200 p-6 w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Icon className={`w-12 h-12 mb-3 ${iconColor}`} />
          <p className="text-lg font-medium mb-5 text-black">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-black hover:bg-gray-800 rounded-full text-white font-medium transition-colors duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
}
