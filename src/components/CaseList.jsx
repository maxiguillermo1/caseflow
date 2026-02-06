// This file shows the list of cases on the left.
// Clicking a case tells the shared notebook “this is the one I picked”.
// SADRR: S=reads shared data, A=click event, D=dispatch select/filter, R=rules in slice, R=list refreshes from useSelector
// SADRR: D=dispatch selectCase, R(Refresh)=useSelector visible list + selection.
import { useDispatch, useSelector } from "react-redux";
import {
  selectCase,
  selectError,
  selectIsLoading,
  selectSelectedCaseId,
  setStatusFilter,
  selectVisibleCases,
} from "../features/cases/casesSlice";

const shorten = (t, n = 120) => (!t ? "" : t.length <= n ? t : `${t.slice(0, n).trimEnd()}…`);

export default function CaseList() {
  const dispatch = useDispatch();
  // INTERVIEW: useSelector = REFRESH (list updates when FILTER or SELECTION changes).
  // LAYMAN: This gets "the list we should show" from the shared notebook.
  const visibleCases = useSelector(selectVisibleCases);
  const selectedCaseId = useSelector(selectSelectedCaseId);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  if (isLoading && visibleCases.length === 0) return <div>Loading cases…</div>;
  if (error && visibleCases.length === 0) return <div role="alert" style={{ color: "crimson" }}>Failed to load cases: {error}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Demo-friendly: show refresh state even when list already has data */}
      {isLoading && visibleCases.length > 0 ? (
        <div style={{ fontSize: 12, opacity: 0.75 }}>Refreshing…</div>
      ) : null}
      {visibleCases.map((c) => (
        <button
          key={c.id}
          onClick={() => {
            // INTERVIEW: CLICK CASE -> ACTION updates selectedCaseId (DETAILS PANEL REFRESHES).
            // LAYMAN: This is like saying "I pick THIS ticket" so the details panel knows what to show.
            dispatch(selectCase(c.id));
            // INTERVIEW: DEMO-FRIENDLY: ALSO SET FILTER TO THE CASE'S STATUS.
            dispatch(setStatusFilter(c.status));
          }}
          style={{
            textAlign: "left",
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: c.id === selectedCaseId ? "#f2f7ff" : "white",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{c.subjectName}</strong>
            <span style={{ fontSize: 12, opacity: 0.75 }}>
              {c.status} • {c.riskCategory}
            </span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Risk: {c.riskScore}/100</div>
          <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>{shorten(c.summary)}</div>
        </button>
      ))}
      {visibleCases.length === 0 ? <div style={{ opacity: 0.7 }}>No cases match this filter.</div> : null}
    </div>
  );
}

