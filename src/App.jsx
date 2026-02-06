// This file is the main “page” layout.
// It kicks off the first data load and puts all the big UI pieces together.
// SADRR: S=data lives in Redux, A=fetchCases/select/filter actions exist, D=dispatch on load, R=rules in slice, R=useSelector makes screen update
//
// Resume Bullet Mapping:
// Resume Bullet #1: React dashboard reads shared investigation state (loading/error/counts)
// Resume Bullet #4: SADRR - State → Action → Dispatch → Reducer → React refresh
//
// SADRR (plain English):
// S: shared data is in Redux (cases slice)
// A: fetch/select/filter actions exist in the slice
// D: this file dispatches fetchCases() on page load
// R: reducers live in casesSlice.js
// R: useSelector below makes the UI update automatically
// SADRR: D=dispatch fetch on load, R(Refresh)=useSelector derived counts + loading/error.
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CaseDetails from "./components/CaseDetails";
import CaseFilters from "./components/CaseFilters";
import CaseList from "./components/CaseList";
import {
  fetchCases,
  selectError,
  selectIsLoading,
  selectStatusCounts,
  selectVisibleCount,
} from "./features/cases/casesSlice";

export default function App() {
  const dispatch = useDispatch();
  // INTERVIEW: useSelector = REFRESH (React re-renders when Redux state changes).
  // LAYMAN: These lines READ the shared notebook so the header numbers stay correct.
  const visibleCount = useSelector(selectVisibleCount);
  const counts = useSelector(selectStatusCounts);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    // INTERVIEW: DISPATCH ASYNC ACTION ON MOUNT (REST FETCH).
    // LAYMAN: When the app starts, ask the internet for cases.
    dispatch(fetchCases());
  }, [dispatch]);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ margin: "0 0 12px" }}>CaseFlow — Risk Case Triage</h1>
      <div style={{ marginBottom: 10, opacity: 0.8, fontSize: 13 }}>
        Demo flow: page loads → fetch → click a case → filter by status → hit Reload.
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <CaseFilters />
        <div style={{ opacity: 0.8 }}>
          Visible Cases: {visibleCount} • OPEN: {counts.OPEN} | REVIEW: {counts.REVIEW} | CLOSED: {counts.CLOSED}
        </div>
      </div>
      <div style={{ margin: "0 0 12px", fontSize: 13 }}>
        <span style={{ opacity: 0.8 }}>Status:</span>{" "}
        {isLoading ? <strong>Fetching…</strong> : <strong>Ready</strong>}
        {error ? (
          <span style={{ marginLeft: 10, color: "crimson" }} role="alert">
            {error}
          </span>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 320 }}><CaseList /></div>
        <div style={{ flex: 1, minWidth: 320 }}><CaseDetails /></div>
      </div>
    </div>
  );
}

