import React from "react";
import ReactPaginate from "react-paginate";

function Paginate({
  dataLength,
  dataPerPage,
  setCurrentPage,
}: {
  dataLength: number;
  dataPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const pageCount = Math.ceil(dataLength / dataPerPage);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <ReactPaginate
      previousLabel={"<"}
      nextLabel={">"}
      pageCount={pageCount}
      onPageChange={changePage}
      containerClassName="paginationContainer"
      activeClassName="paginationActive"
      nextLinkClassName="link"
      marginPagesDisplayed={1}
    />
  );
}

export default Paginate;
