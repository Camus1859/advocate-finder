interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  const totalPagesArr = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center gap-5 mt-6 flex-wrap"
    >
      <div aria-live="polite" className="flex items-center">
        Showing {startIndex + 1} - {endIndex} of {totalItems} results
      </div>

      <div className="flex gap-2">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to previous page"
        >
          Previous
        </button>

        {totalPagesArr.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            aria-label={`Go to page ${page + 1}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page + 1}
          </button>
        ))}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
