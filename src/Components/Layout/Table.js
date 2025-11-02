import React from "react";
import PropTypes from "prop-types";

const Table = ({
  columns = [],
  data = [],
  showActions = true,
  showEdit = true,
  showDelete = true,
  showShow = true,
  onEdit = () => {},
  onDelete = () => {},
  onShow = () => {},
}) => {
  const getCellValue = (row, accessor) => {
    if (row == null) return "-";
    if (typeof accessor === "function") return accessor(row);
    if (accessor in row) return row[accessor];
    const keys = Object.keys(row);
    const foundKey = keys.find(
      (k) => k.toLowerCase() === String(accessor).toLowerCase()
    );
    if (foundKey) return row[foundKey];
    return "-";
  };

  return (
    <div className="container-fluid p-4">
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped align-middle text-center">
          <thead className="table-marine-blue text-white">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.label}</th>
              ))}
              {showActions && <th style={{ width: 160 }}>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>{getCellValue(row, col.accessor)}</td>
                  ))}

                  {showActions && (
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {showEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            className="btn btn-sm btn-primary"
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        )}

                        {showShow && (
                          <button
                            type="button"
                            onClick={() => onShow(row)}
                            className="btn btn-sm btn-success"
                            title="Show"
                          >
                            <i className="bi bi-search"></i>
                          </button>
                        )}

                        {showDelete && (
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                typeof window !== "undefined" &&
                                window.confirm("Are you sure you want to delete this item?")
                              ) {
                                onDelete(row);
                              }
                            }}
                            className="btn btn-sm btn-danger"
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="text-center text-muted py-4"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  showActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onShow: PropTypes.func,
};

export default Table;
