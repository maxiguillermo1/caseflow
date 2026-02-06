// This file draws the little risk bar.
// The bar gets longer when the risk number is bigger.
// SADRR: S=reads shared data, A=case selection happened elsewhere, D=no dispatch here, R=rules in slice, R=bar refreshes from useSelector
// SADRR: R(Refresh)=useSelector reads selected case; bar updates when selection changes.
import { useSelector } from "react-redux";
import { selectSelectedCase } from "../features/cases/casesSlice";

export default function RiskBar() {
  // INTERVIEW: VISUALIZATION is still just STATE -> UI (riskScore drives bar width).
  // LAYMAN: Higher score = longer bar.
  const selected = useSelector(selectSelectedCase);
  const score = selected?.riskScore ?? 0;
  const color = score >= 70 ? "#d14343" : score >= 40 ? "#d39b2a" : "#2c8a4a";

  return (
    <div aria-label={`Risk score ${score} out of 100`} style={{ height: 10, borderRadius: 999, background: "#eee", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${score}%`, background: color }} />
    </div>
  );
}

