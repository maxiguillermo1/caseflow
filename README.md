CaseFlow — React + Redux

A tiny **React (JavaScript) + Redux Toolkit** “risk case triage” demo app.

It’s built to clearly show **SADRR**:

- **S (State)**: one Redux slice stores cases, selection, filter, loading, error
- **A (Actions)**: `fetchCases`, `selectCase(id)`, `setStatusFilter(value)`
- **D (Dispatch)**: UI dispatches actions from components
- **R (Reducer)**: reducers/extraReducers update state predictably
- **R (Refresh)**: components re-render via `useSelector`

Run it

```bash
npm install
npm run dev
```

Useful scripts

```bash
npm run lint
npm test
npm run build
```

Where the important code is

- `src/main.jsx`: connects React to Redux `<Provider>`
- `src/app/store.js`: creates the Redux store
- `src/features/cases/casesSlice.js`: state + actions + reducers + selectors + REST fetch
- `src/components/CaseFilters.jsx`: status filter + reload (dispatch)
- `src/components/CaseList.jsx`: case list + selection (dispatch)
- `src/components/CaseDetails.jsx`: selected case details (selector refresh)
- `src/components/RiskBar.jsx`: tiny risk visualization (selector refresh)