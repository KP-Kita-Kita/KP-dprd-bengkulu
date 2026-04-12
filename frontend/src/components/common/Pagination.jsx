import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2.5 rounded-lg border border-gray-200 text-gray-500
                 hover:bg-primary-50 hover:text-primary-800 hover:border-primary-200
                 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <FaChevronLeft size={12} />
      </button>

      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
              page === currentPage
                ? 'bg-primary-800 text-white shadow-md'
                : 'border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-800 hover:border-primary-200'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-lg border border-gray-200 text-gray-500
                 hover:bg-primary-50 hover:text-primary-800 hover:border-primary-200
                 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  );
}
