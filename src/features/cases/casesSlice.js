// This file is the “RULES + DATA” for the shared notebook (Redux).
// It decides what data we store, what events can happen, and how the data changes.
// SADRR: S=initialState, A=actions + fetchCases, D=UI calls dispatch(...), R=reducers/extraReducers, R=selectors help the screen update
//
// Resume Bullet Mapping:
// Resume Bullet #1: Redux Toolkit slice stores shared investigation state (items, selectedCaseId, statusFilter, isLoading, error)
// Resume Bullet #2: createAsyncThunk fetches REST data and tracks loading/error
// Resume Bullet #4: SADRR is documented and easy to explain from this file
//
// SADRR (plain English):
// S: data lives in initialState (and the store uses this slice)
// A: actions are selectCase/setStatusFilter + fetchCases()
// D: UI uses dispatch(...) in components
// R: reducers/extraReducers decide how the notebook changes
// R: selectors + useSelector make the screen update automatically
// SADRR:
// S = STATE (single source of truth)
// A = ACTIONS (events)
// D = DISPATCH (from UI components)
// R = REDUCERS (rules of change)
// R = REFRESH (useSelector re-renders UI)
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/*
  Everything below this point is just HELPERS to turn
  boring API data into readable, realistic "risk cases".

  Think of this as a fake backend / microservice layer.
*/
// LAYMAN: These helper lists are just “ingredients” to build nice-looking cases.

// Fake names and data used to build readable cases
const PEOPLE_FIRST = ["Alex", "Jordan", "Sam", "Taylor", "Morgan"];
const PEOPLE_LAST = ["Ng", "Patel", "Garcia", "Kim", "Johnson"];
const COMPANIES = ["Northstar Trading", "Blue Harbor LLC", "Orchid Ventures"];

// Possible risk signals shown in the UI
const SIGNALS = [
  "Sanctions match",
  "Adverse media",
  "High-risk jurisdiction",
  "Rapid account turnover",
  "Unusual transaction pattern",
];

// English reasons used in the summary text
const REASONS = [
  "unusual transaction patterns inconsistent with prior activity",
  "identity information that does not fully match available records",
  "counterparties linked to high-risk geographies",
  "a sudden spike in volume and velocity over a short period",
  "payment behavior that resembles known fraud typologies",
];

// Limit how many cases the UI shows at once
const MAX_VISIBLE = 30;
// LAYMAN: We only show the first 30 so the screen doesn’t look too crowded.

/*
  The functions below are deterministic (no randomness).
  The same ID will ALWAYS produce the same result.
*/

// Assign AML / KYC / FRAUD based on ID
const riskCategoryFromId = (id) =>
  id % 3 === 0 ? "AML" : id % 3 === 1 ? "KYC" : "FRAUD";
// LAYMAN: Same id always gives the same category (no guessing).

// Assign OPEN / REVIEW / CLOSED based on ID
const statusFromId = (id) =>
  id % 3 === 0 ? "OPEN" : id % 3 === 1 ? "REVIEW" : "CLOSED";
// LAYMAN: Same id always gives the same status.

// Pick two signals based on ID
const signalsFromId = (id) =>
  [
    SIGNALS[id % SIGNALS.length],
    SIGNALS[(id + 2) % SIGNALS.length],
  ].filter((v, i, a) => a.indexOf(v) === i);
// LAYMAN: A “signal” is a short warning label. We pick them in a repeatable way.

// Decide whether the subject is a person or company
const subjectNameFrom = ({ userId, id }) =>
  userId % 2 === 0
    ? COMPANIES[(id + userId) % COMPANIES.length]
    : `${PEOPLE_FIRST[(userId + id) % PEOPLE_FIRST.length]} ${
        PEOPLE_LAST[(id * 7) % PEOPLE_LAST.length]
      }`;
// LAYMAN: This just makes names so the list feels real.

// Build a readable English investigation summary
const englishSummary = ({
  subjectName,
  riskCategory,
  status,
  riskScore,
  signals,
  id,
}) =>
  `Investigation note: We flagged ${subjectName} for a ${riskCategory} review because ${
    REASONS[id % REASONS.length]
  }. Status: ${status}. Risk score: ${riskScore}/100.${
    signals.length ? ` Key signals: ${signals.join(", ")}.` : ""
  }`;
// LAYMAN: This turns all the numbers into a normal sentence a human can read.

/*
  Pure transformer:
  Given a JSONPlaceholder post, deterministically build a "case".
  This is easy to unit test (no network, no Redux).
*/
export function buildCaseFromPost(post) {
  // INTERVIEW: PURE FUNCTION = EASY TO TEST (no network, no Redux).
  // LAYMAN: This takes a "post" from the internet and turns it into a "case" our app understands.
  // LAYMAN: Think “raw ingredients” -> “finished meal”.
  const id = post.id;
  const subjectName = subjectNameFrom(post);
  const riskCategory = riskCategoryFromId(id);
  const status = statusFromId(id);
  const riskScore = (id * 13) % 101;
  // LAYMAN: riskScore is just a repeatable math formula (so demos don’t change randomly).
  const signals = signalsFromId(id);
  const summary = englishSummary({
    subjectName,
    riskCategory,
    status,
    riskScore,
    signals,
    id,
  });

  return { id, subjectName, riskCategory, status, riskScore, signals, summary };
}

/*
  ASYNC ACTION (A):
  This is the "Ajax call" part.
  Components can dispatch fetchCases() to load data.
*/
export const fetchCases = createAsyncThunk(
  "cases/fetchCases",
  async (_, { rejectWithValue }) => {
    try {
      // INTERVIEW: REST API CALL (AJAX) happens in a THUNK (async action).
      // LAYMAN: This is like making a phone call to the server to ask for the list of cases.
      // LAYMAN: While this is happening, the app shows “Fetching…”.
      // Resume Bullet #2: REST fetch happens here (async action).
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const posts = await res.json();

      // INTERVIEW: TRANSFORM SERVICE DATA -> UI-FRIENDLY "CASES" (deterministic).
      // LAYMAN: We clean up the data so the UI can show names, statuses, and risk scores.
      return posts.map(buildCaseFromPost);
    } catch (err) {
      // If anything fails, store a readable error
      return rejectWithValue(
        err?.message ?? "Failed to fetch cases"
      );
    }
  }
);

/*
  STATE (S):
  This is the single source of truth for cases.
*/
const initialState = {
  // INTERVIEW: THIS IS THE EXACT SHARED STATE SHAPE (easy to point at).
  // LAYMAN: This is the shared notebook: list of cases + what you clicked + filter + loading + error.
  items: [],              // all cases
  selectedCaseId: null,   // which case is selected
  statusFilter: "ALL",    // ALL / OPEN / REVIEW / CLOSED
  isLoading: false,       // API in progress?
  error: null,            // API error message
};
// LAYMAN: When any of these values change, the screen updates automatically.

/*
  REDUCERS (R):
  These define how state changes.
*/
const casesSlice = createSlice({
  name: "cases",
  initialState,

  // Sync actions (simple UI actions)
  reducers: {
    // User clicks a case
    selectCase(state, action) {
      // INTERVIEW: REDUCER = predictable update (no side effects).
      // LAYMAN: Save “the id of the case I picked” in the notebook.
      state.selectedCaseId = action.payload;
    },

    // User changes filter
    setStatusFilter(state, action) {
      // LAYMAN: Save “which status we want to show” in the notebook.
      state.statusFilter = action.payload;
    },
  },

  // Async lifecycle handlers
  extraReducers: (builder) => {
    builder
      // API call started
      .addCase(fetchCases.pending, (state) => {
        // INTERVIEW: PENDING -> isLoading=true (SHOW LOADING IN UI).
        // LAYMAN: We are waiting for the internet.
        // Resume Bullet #2: pending/fulfilled/rejected = clear async request handling.
        state.isLoading = true;
        state.error = null;
      })

      // API call succeeded
      .addCase(fetchCases.fulfilled, (state, action) => {
        // INTERVIEW: FULFILLED -> items=data, isLoading=false (DATA STORED IN REDUX).
        // LAYMAN: The internet answered, so we save the case list.
        state.isLoading = false;
        state.items = action.payload;

        // Keep selection valid after reload
        if (
          !state.items.some(
            (c) => c.id === state.selectedCaseId
          )
        ) {
          state.selectedCaseId =
            state.items[0]?.id ?? null;
        }
      })

      // API call failed
      .addCase(fetchCases.rejected, (state, action) => {
        // INTERVIEW: REJECTED -> error message stored (SHOW ERROR IN UI).
        // LAYMAN: Something went wrong, so we save a message to show on screen.
        state.isLoading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Unknown error";
      });
  },
});

// Export actions for components to dispatch
export const { selectCase, setStatusFilter } =
  casesSlice.actions;
// LAYMAN: These are the “buttons” the UI can press (through dispatch).

// Export reducer for the Redux store
export default casesSlice.reducer;

/*
  SELECTORS (Refresh):
  Components use useSelector() with these.
  When state changes, React re-renders automatically.
*/
const S = (state) => state.cases;
// LAYMAN: S(state) just means “go to the cases page in the notebook”.

export const selectSelectedCaseId = (state) =>
  S(state).selectedCaseId;

export const selectStatusFilter = (state) =>
  S(state).statusFilter;

export const selectIsLoading = (state) =>
  S(state).isLoading;

export const selectError = (state) =>
  S(state).error;

export const selectSelectedCase = (state) =>
  // INTERVIEW: SELECTOR = derived read; UI REFRESHES when selectedCaseId changes.
  // LAYMAN: Find the full case object for the case you clicked.
  S(state).items.find(
    (c) => c.id === S(state).selectedCaseId
  ) || null;

export const selectVisibleCases = (state) =>
  // LAYMAN: This applies the filter (ALL/OPEN/REVIEW/CLOSED) to decide what to show in the list.
  (S(state).statusFilter === "ALL"
    ? S(state).items
    : S(state).items.filter(
        (c) => c.status === S(state).statusFilter
      )
  ).slice(0, MAX_VISIBLE);

export const selectVisibleCount = (state) =>
  selectVisibleCases(state).length;

export const selectStatusCounts = (state) =>
  S(state).items.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    { OPEN: 0, REVIEW: 0, CLOSED: 0 }
  );
