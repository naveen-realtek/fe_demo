import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select, Input, Button } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";

const UserPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  setRowsPerPage,
  totalRows,
}) => {
  const [jumpToPage, setJumpToPage] = useState("");

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpToPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
    setJumpToPage("");
  };

  return (
    <div className="pagination-container">
      {/* Left Side: Rows per page */}
      <div className="pagination-options">
        <span>Rows per page:</span>
        <Select
          value={rowsPerPage}
          onChange={setRowsPerPage}
          style={{ width: 80, marginLeft: 5 }}
        >
          <Select.Option value={5}>5 / page</Select.Option>
          <Select.Option value={10}>10 / page</Select.Option>
        </Select>
      </div>

      {/* Right Side: Jump to & Page Navigation */}
      <div className="pagination-right">
        <div className="pagination-jump">
          <span>Jump to:</span>
          <Input
            type="number"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            onPressEnter={handleJumpToPage}
            style={{ width: 60, marginLeft: 5, marginRight: 5 }}
          />
          <Button onClick={handleJumpToPage}>Go</Button>
        </div>

        <div className="pagination-controls">
          <Button
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            icon={<DoubleLeftOutlined />}
          />
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            icon={<LeftOutlined />}
          />

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <Button
                key={pageNum}
                className={currentPage === pageNum ? "ant-tag-selected" : ""}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            icon={<RightOutlined />}
          />
          <Button
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            icon={<DoubleRightOutlined />}
          />
        </div>
      </div>
    </div>
  );
};

UserPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  totalRows: PropTypes.number.isRequired,
};

export default UserPagination;
