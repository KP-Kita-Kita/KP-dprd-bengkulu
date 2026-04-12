export default function LoadingSpinner({ size = 'md', text = 'Memuat...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div
        className={`${sizeClasses[size]} rounded-full border-primary-200
                   border-t-primary-800 animate-spin`}
      />
      {text && <p className="text-gray-500 text-sm font-medium">{text}</p>}
    </div>
  );
}
