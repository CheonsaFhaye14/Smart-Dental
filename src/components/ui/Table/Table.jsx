import React, { useMemo, useState } from "react";
import "./Table.css";
import AppInput from "../../common/AppInput";

const Table = ({
  columns = [],        // { header, accessor, render?, filterFn? }
  data = [],           // array of row objects
  filters = {},        // { accessor: value }
  setFilters,          // setter for filters
  rowsPerPage = 5,     // rows per page
  renderActions,       // (row) => <jsx> — fully custom per page
  renderModal,         // (row, onClose) => <jsx> — custom modal
  renderFilters,
  emptyMessage = "No data available",
}) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const showActions = !!renderActions;

  // ── Reset ────────────────────────────────────────────
  const handleReset = () => {
    setSearch("");
    setSortConfig({ key: "", direction: "" });
    setCurrentPage(1);
    setShowAll(false);
    setFilters?.({});
  };

  const isResetDisabled =
    !search &&
    !sortConfig.key &&
    !showAll &&
    (!filters || Object.values(filters).every((v) => !v));

  // ── Filter ───────────────────────────────────────────
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const searchMatch = Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const filtersMatch = Object.keys(filters).every((key) => {
        const filterValue = filters[key];
        if (!filterValue) return true;
        const cellValue = row[key];
        const col = columns.find((c) => c.accessor === key);
        return col?.filterFn
          ? col.filterFn(cellValue, filterValue, row)
          : String(cellValue ?? "")
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());
      });

      return searchMatch && filtersMatch;
    });
  }, [data, search, filters, columns]);

  // ── Sort ─────────────────────────────────────────────
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const isDate = (val) => val && !isNaN(Date.parse(val));
    const isNumber = (val) => val !== null && val !== "" && !isNaN(Number(val));

    return [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === "string") aVal = aVal.trim();
      if (typeof bVal === "string") bVal = bVal.trim();

      if (isNumber(aVal) && isNumber(bVal)) {
        return sortConfig.direction === "asc"
          ? Number(aVal) - Number(bVal)
          : Number(bVal) - Number(aVal);
      }

      if (isDate(aVal) && isDate(bVal)) {
        return sortConfig.direction === "asc"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal), undefined, { sensitivity: "base" })
        : String(bVal).localeCompare(String(aVal), undefined, { sensitivity: "base" });
    });
  }, [filteredData, sortConfig]);

  // ── Sort handler ─────────────────────────────────────
  const handleSort = (key) => {
    setCurrentPage(1);
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ── Pagination ───────────────────────────────────────
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = showAll
    ? sortedData
    : sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const colSpanTotal = columns.length + (showActions ? 1 : 0);

  return (
    <div className="table-wrapper">

      {/* ── Toolbar ───────────────────────────────────── */}
      <div className="table-toolbar">
        <AppInput
            label="Search"
            value={search}
            onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
            }}
        />
        {renderFilters && (
    <div className="table-filters">
      {renderFilters(filters, setFilters)}
    </div>
  )}

  <div className="table-toolbar-btns">
    <button className="btn-showall" onClick={() => setShowAll((p) => !p)}>
      {showAll ? "📄 Paginate" : "📋 Show All"}
    </button>
    <button className="btn-reset" onClick={handleReset} disabled={isResetDisabled}>
      ↺ Reset
    </button>
  </div>
</div>

      {/* ── Table ─────────────────────────────────────── */}
      <div className="table-scroll">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  onClick={() => handleSort(col.accessor)}
                  className="sortable"
                >
                  <span>{col.header}</span>
                  <span className="sort-icon">
                    {sortConfig.key === col.accessor
                      ? sortConfig.direction === "asc" ? " ▲" : " ▼"
                      : " ⇅"}
                  </span>
                </th>
              ))}
              {showActions && <th className="actions-th">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => renderModal && setSelectedRow(row)}
                  style={{ cursor: renderModal ? "pointer" : "default" }}
                >
                  {columns.map((col) => (
                    <td key={col.accessor}>
                      {col.render ? col.render(row) : row[col.accessor] ?? "—"}
                    </td>
                  ))}

                  {showActions && (
                    <td className="actions-td" onClick={(e) => e.stopPropagation()}>
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={colSpanTotal} className="no-data">
                  <span>🌸</span> {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ────────────────────────────────── */}
      {!showAll && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ‹ Prev
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-num ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="page-btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next ›
          </button>
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────── */}
      {selectedRow && renderModal && renderModal(selectedRow, () => setSelectedRow(null))}
    </div>
  );
};

export default Table;