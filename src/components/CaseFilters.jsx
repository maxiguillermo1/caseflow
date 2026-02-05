// SADRR: D=dispatch filter + reload, R(Refresh)=useSelector shows filter/loading/error.
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCases,
  selectError,
  selectIsLoading,
  selectStatusFilter,
  setStatusFilter,
} from "../features/cases/casesSlice";

export default function CaseFilters() {
  const dispatch = useDispatch();
  const statusFilter = useSelector(selectStatusFilter);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        Status
        <select value={statusFilter} onChange={(e) => dispatch(setStatusFilter(e.target.value))} disabled={isLoading}>
          {["ALL", "OPEN", "REVIEW", "CLOSED"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <button onClick={() => dispatch(fetchCases())} disabled={isLoading}>
        {isLoading ? "Loading..." : "Reload"}
      </button>
      {error ? (
        <span style={{ color: "crimson" }} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

