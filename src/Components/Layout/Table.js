import PropTypes from "prop-types";
import useTranslate from "../../Hooks/Translation/useTranslate";

const Table = ({
  columns = [],
  data = [],
  showActions = true,
  showEdit = true,
  showDelete = true,
  showShow = true,
  onEdit = () => { },
  onDelete = () => { },
  onShow = () => { },
  customActions = null, // Function that receives (row) and returns JSX
  highLight = false,
  highLightKey = null
}) => {
  const { t } = useTranslate();

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";

    if (date.getFullYear() < 1900) return "-";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };


  const isDateValue = (val) => {
    if (!val) return false;

    if (val instanceof Date && !isNaN(val.getTime())) return true;

    if (typeof val === "string" && val.includes("T")) {
      const d = new Date(val);
      return !isNaN(d.getTime());
    }

    return false;
  };

  const getCellValue = (row, accessor) => {
    if (!row) return "-";

    if (typeof accessor === "function") return accessor(row);

    if (typeof accessor === "string" && accessor.includes(".")) {
      return accessor.split(".").reduce((acc, key) => {
        return acc && acc[key] !== undefined ? acc[key] : "-";
      }, row);
    }

    if (accessor in row) {
      let value = row[accessor];

      if (isDateValue(value)) {
        return formatDate(new Date(value));
      }

      if (typeof value === "boolean") return value ? t("Yes") : t("No");

      if (value === null || value === undefined || value === "") return "-";

      return value;
    }

    const keys = Object.keys(row);
    const foundKey = keys.find(
      (k) => k.toLowerCase() === String(accessor).toLowerCase()
    );
    if (foundKey) return row[foundKey];

    return "-";
  };

  // Get raw cell value without transformations (for custom render functions)
  const getRawCellValue = (row, accessor) => {
    if (!row) return null;
    if (typeof accessor === "function") return accessor(row);
    if (typeof accessor === "string" && accessor.includes(".")) {
      return accessor.split(".").reduce((acc, key) => {
        return acc && acc[key] !== undefined ? acc[key] : null;
      }, row);
    }
    if (accessor in row) {
      return row[accessor];
    }
    // Case-insensitive fallback
    const keys = Object.keys(row);
    const foundKey = keys.find(
      (k) => k.toLowerCase() === String(accessor).toLowerCase()
    );
    if (foundKey) return row[foundKey];
    return null;
  };

  return (
    <div className="container-fluid p-4">
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped align-middle text-center eg-table table-marine-blue">
          <thead className="table-marine-blue text-white">
            <tr>
              {columns.map((col, idx) => (
                <th className="whitespace-nowrap" key={idx}>
                  {col.label}
                </th>
              ))}
              {showActions && <th style={{ width: 160 }}>{t("Actions")}</th>}
            </tr>
          </thead>

          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className={`${highLight && !row[highLightKey] ? "table-warning" : ""}`}>
                  {columns.map((col, colIndex) => {
                    // Use raw value for custom render functions, formatted value otherwise
                    const cellValue = col.render
                      ? getRawCellValue(row, col.accessor)
                      : getCellValue(row, col.accessor);
                    return (
                      <td className="whitespace-nowrap" key={colIndex}>
                        {col.render ? col.render(cellValue, row, rowIndex) : cellValue}
                      </td>
                    );
                  })}

                  {showActions && (
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {customActions && customActions(row)}
                        {showEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            className="btn btn-sm btn-primary"
                            title={t("Edit")}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        )}
                        {showShow && (
                          <button
                            type="button"
                            onClick={() => onShow(row)}
                            className="btn btn-sm btn-warning"
                            title={t("Show")}
                          >
                            <i className="bi bi-search"></i>
                          </button>
                        )}

                        {showDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(row)}
                            className="btn btn-sm btn-danger"
                            title={t("Delete")}
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
                  {t("No data available")}
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
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  showShow: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onShow: PropTypes.func,
};

export default Table;
