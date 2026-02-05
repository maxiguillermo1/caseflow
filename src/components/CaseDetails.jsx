// SADRR: R(Refresh)=useSelector reads selected case; details update on selection.
import { useSelector } from "react-redux";
import { selectIsLoading, selectSelectedCase } from "../features/cases/casesSlice";
import RiskBar from "./RiskBar";

export default function CaseDetails() {
  // INTERVIEW: REFRESH — when selectedCaseId changes, this selector returns a new case and React re-renders.
  const selected = useSelector(selectSelectedCase);
  const isLoading = useSelector(selectIsLoading);

  if (isLoading && !selected) return <div>Loading…</div>;
  if (!selected) return <div style={{ opacity: 0.7 }}>Select a case to see details.</div>;

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
      {isLoading ? <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>Refreshing…</div> : null}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>{selected.subjectName}</h2>
        <span style={{ opacity: 0.75 }}>{selected.status}</span>
      </div>

      <div style={{ marginTop: 8, fontSize: 13, opacity: 0.85 }}>
        Case ID: {selected.id} • Category: <strong>{selected.riskCategory}</strong> • Risk: <strong>{selected.riskScore}</strong>/100
      </div>

      <div style={{ marginTop: 10 }}><RiskBar /></div>

      <div style={{ marginTop: 10, fontSize: 13 }}>
        <strong>Signals</strong>
        <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
          {selected.signals.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>

      <hr style={{ margin: "12px 0", border: 0, borderTop: "1px solid #eee" }} />
      <p style={{ margin: 0, lineHeight: 1.5 }}>{selected.summary}</p>
    </div>
  );
}

