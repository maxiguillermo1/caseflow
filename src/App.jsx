// SADRR: D=dispatch fetch on load, R(Refresh)=useSelector derived counts + visible cases.
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CaseDetails from "./components/CaseDetails";
import CaseFilters from "./components/CaseFilters";
import CaseList from "./components/CaseList";
import {
  fetchCases,
  selectStatusCounts,
  selectVisibleCount,
} from "./features/cases/casesSlice";

export default function App() {
  const dispatch = useDispatch();
  const visibleCount = useSelector(selectVisibleCount);
  const counts = useSelector(selectStatusCounts);

  useEffect(() => {
    // Fetch once on app load (REST call to demonstrate async SADRR).
    dispatch(fetchCases());
  }, [dispatch]);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ margin: "0 0 12px" }}>CaseFlow — Risk Case Triage</h1>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <CaseFilters />
        <div style={{ opacity: 0.8 }}>
          Visible Cases: {visibleCount} • OPEN: {counts.OPEN} | REVIEW: {counts.REVIEW} | CLOSED: {counts.CLOSED}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 320 }}><CaseList /></div>
        <div style={{ flex: 1, minWidth: 320 }}><CaseDetails /></div>
      </div>
    </div>
  );
}

