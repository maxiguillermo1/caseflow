// This file controls the top filter + reload button.
// It lets the user change what the list shows.
// SADRR: S=reads shared data, A=filter/reload events, D=dispatch actions, R=rules in slice, R=screen updates automatically
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
  // INTERVIEW: SELECTORS READ SHARED STATE (FILTER / LOADING / ERROR).
  // LAYMAN: These lines "read the notebook" so the dropdown shows the current choice.
  const statusFilter = useSelector(selectStatusFilter);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        Status
        <select
          value={statusFilter}
          onChange={(e) => dispatch(setStatusFilter(e.target.value))} // INTERVIEW: FILTER ACTION (NO RELOAD NEEDED)
          disabled={isLoading}
        >
          {["ALL", "OPEN", "REVIEW", "CLOSED"].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={() => {
          // INTERVIEW: RELOAD = RESET FILTER TO ALL, THEN REFETCH FROM REST API.
          dispatch(setStatusFilter("ALL"));
          dispatch(fetchCases());
        }}
        disabled={isLoading}
      >
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

