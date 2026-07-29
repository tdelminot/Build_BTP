import { useState } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const changePage = (newPage) => {
    setPage(newPage);
  };

  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  return {
    page,
    limit,
    changePage,
    changeLimit,
    offset: (page - 1) * limit
  };
};