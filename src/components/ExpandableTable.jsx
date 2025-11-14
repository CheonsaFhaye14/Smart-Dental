import React, { useMemo, useState } from "react";
import "./Table.css";
import FloatingInput from "../utils/InputForm";
import ActionButtons from "../components/ActionButtons";

const ExpandableTable = ({
  columns = [],
  data = [],
  expandColumns = [],
  nestedKey,
  filters = {},
  setFilters,
  hideActionsCondition,
}) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "", type: "main" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const rowsPerPage = 5;

  const handleReset = () => {
    setSearch("");
    setSortConfig({ key: "", direction: "", type: "main" });
    setCurrentPage(1);
    setShowAll(false);
    setFilters?.({});
  };

const filteredData = useMemo(() => {
  return data.filter((row) => {
    const searchText = search.toLowerCase();

    // ✅ Search in main row (same as before)
    const mainRowMatch = Object.values(row)
      .filter((v) => typeof v !== "object")
      .join(" ")
      .toLowerCase()
      .includes(searchText);

    // ✅ Search inside nested rows (this is new!)
    const nestedRows = row[nestedKey] || [];
    const nestedMatch = nestedRows.some((nestedRow) =>
      Object.values(nestedRow)
        .filter((v) => typeof v !== "object")
        .join(" ")
        .toLowerCase()
        .includes(searchText)
    );

    // ✅ Apply column filters (unchanged)
    const filtersMatch = Object.keys(filters).every((key) => {
      const filterValue = filters[key];
      if (!filterValue) return true;
      const col = columns.find((c) => c.accessor === key);
      const cellValue = row[key];
      return col?.filterFn
        ? col.filterFn(cellValue, filterValue, row)
        : String(cellValue)
            ?.toLowerCase()
            .includes(String(filterValue).toLowerCase());
    });

    // ✅ Return true if search matches EITHER main or nested rows
    return (mainRowMatch || nestedMatch) && filtersMatch;
  });
}, [data, search, filters, columns, nestedKey]);

const sortedData = useMemo(() => {
  if (!sortConfig.key || sortConfig.type !== "main") return filteredData;

  const compare = (a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    // Convert undefined/null to empty for safe comparison
    if (aVal === undefined || aVal === null) aVal = "";
    if (bVal === undefined || bVal === null) bVal = "";

    // Detect Number
    const isNumber = !isNaN(aVal) && !isNaN(bVal);

    // Detect Date
    const aDate = new Date(aVal);
    const bDate = new Date(bVal);
    const isDate = !isNaN(aDate) && !isNaN(bDate);

    if (isDate) {
      return sortConfig.direction === "asc"
        ? aDate - bDate
        : bDate - aDate;
    }

    if (isNumber) {
      return sortConfig.direction === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    }

    // Default: Alphabetical (case-insensitive)
    return sortConfig.direction === "asc"
      ? String(aVal).toLowerCase().localeCompare(String(bVal).toLowerCase())
      : String(bVal).toLowerCase().localeCompare(String(aVal).toLowerCase());
  };

  return [...filteredData].sort(compare);
}, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = showAll
    ? sortedData
    : sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (key, type = "main") => {
    setCurrentPage(1);
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      type,
    }));
  };

  const isResetDisabled =
    !search &&
    !sortConfig.key &&
    !showAll &&
    (!filters || Object.values(filters).every((v) => !v));

  return (
    <div className="table-wrapper">
      {/* Search & Controls */}
      <div style={{ display: "flex", gap: "10px" }}>
        <FloatingInput
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className="Showall-btn" onClick={() => setShowAll((prev) => !prev)}>
          {showAll ? "Paginate" : "Show All"}
        </button>

        <button onClick={handleReset} disabled={isResetDisabled} className="reset-btn">
          Reset
        </button>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                onClick={() => handleSort(col.accessor, "main")}
                className="sortable"
              >
                {col.header}
                {sortConfig.key === col.accessor && sortConfig.type === "main" && (
                  <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, i) => {
              // sort nested rows if expandColumns sorting is active
              let nestedRows = row[nestedKey] || [];
             if (sortConfig.key && sortConfig.type === "nested") {
  nestedRows = [...nestedRows].sort((a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (aVal === undefined || aVal === null) aVal = "";
    if (bVal === undefined || bVal === null) bVal = "";

    const isNumber = !isNaN(aVal) && !isNaN(bVal);
    const aDate = new Date(aVal);
    const bDate = new Date(bVal);
    const isDate = !isNaN(aDate) && !isNaN(bDate);

    if (isDate) {
      return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
    }

    if (isNumber) {
      return sortConfig.direction === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    }

    return sortConfig.direction === "asc"
      ? String(aVal).toLowerCase().localeCompare(String(bVal).toLowerCase())
      : String(bVal).toLowerCase().localeCompare(String(aVal).toLowerCase());
  });
}

              return (
                <React.Fragment key={i}>
                  {/* Main Row */}
                 <tr>
  {columns.map((col) => (
    <td key={col.accessor} style={{ fontWeight: "bold" }}>
      {col.render ? col.render(row) : row[col.accessor]}
    </td>
  ))}
  <td>
    {!hideActionsCondition?.(row) && (
      <ActionButtons
        onEdit={row.onEdit}
        onDelete={row.onDelete}
        onUndo={row.onUndo}
      />
    )}
  </td>
</tr>


                  {/* Expanded Table always visible */}
                  {nestedRows.length > 0 && (
                    <tr>
                      <td colSpan={columns.length + 1} style={{ padding: 0, border: "none" }}>
                        <div className="expanded-table-wrapper">
                          <table className="nested-table">
                            <thead>
                              <tr>
                                {expandColumns.map((col) => (
                                  <th
                                    key={col.accessor}
                                    onClick={() => handleSort(col.accessor, "nested")}
                                    className="sortable"
                                  >
                                    {col.header}
                                    {sortConfig.key === col.accessor &&
                                      sortConfig.type === "nested" && (
                                        <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                                      )}
                                  </th>
                                ))}
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {nestedRows.map((nestedRow, idx) => (
                                <tr key={idx}>
                                  {expandColumns.map((col) => (
                                    <td key={col.accessor}>
                                      {col.render ? col.render(nestedRow) : nestedRow[col.accessor]}
                                    </td>
                                  ))}
                                  <td>
                                    <ActionButtons
                                      onEdit={nestedRow.onEdit}
                                      onDelete={nestedRow.onDelete}
                                      onUndo={nestedRow.onUndo}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length + 1}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {!showAll && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpandableTable;
