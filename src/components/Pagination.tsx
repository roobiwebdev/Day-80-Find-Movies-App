const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="text-[#9a7ce7] w-full flex justify-between items-center mt-10">
        <button
          onClick={handlePreviousPage}
          className="px-2 py-1 rounded-lg bg-[#291a50] cursor-pointer"
          disabled={currentPage === 1}
        >
          <img src="./arrow-right-tiny.svg" alt="left arrow" />
        </button>
        <span className="text-[#9a7ce7] text-lg font-semibold">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className="px-2 py-1 rounded-lg bg-[#291a50] cursor-pointer"
          disabled={currentPage === totalPages}
        >
          <img src="./arrow-left-tiny.svg" alt="right arrow" />
        </button>
      </div>
    </div>
  );
};
export default Pagination;
