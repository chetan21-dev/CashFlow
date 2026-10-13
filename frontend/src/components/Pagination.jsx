// components/Pagination.jsx
const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  // Show up to 5 page numbers around the current page
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav aria-label="Transaction history pages">
      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>
            Previous
          </button>
        </li>

        {start > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onChange(1)}>1</button>
            </li>
            {start > 2 && (
              <li className="page-item disabled"><span className="page-link">…</span></li>
            )}
          </>
        )}

        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
            <button
              className="page-link"
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          </li>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <li className="page-item disabled"><span className="page-link">…</span></li>
            )}
            <li className="page-item">
              <button className="page-link" onClick={() => onChange(totalPages)}>
                {totalPages}
              </button>
            </li>
          </>
        )}

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;