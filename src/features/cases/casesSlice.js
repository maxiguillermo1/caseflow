// SADRR: 
// S = cases state (what data exists)
// A = actions + fetchCases async action
// R = reducers (how data changes)
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/*
  Everything below this point is just HELPERS to turn
  boring API data into readable, realistic "risk cases".

  Think of this as a fake backend / microservice layer.
*/

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

/*
  The functions below are deterministic (no randomness).
  The same ID will ALWAYS produce the same result.
*/

// Assign AML / KYC / FRAUD based on ID
const riskCategoryFromId = (id) =>
  id % 3 === 0 ? "AML" : id % 3 === 1 ? "KYC" : "FRAUD";

// Assign OPEN / REVIEW / CLOSED based on ID
const statusFromId = (id) =>
  id % 3 === 0 ? "OPEN" : id % 3 === 1 ? "REVIEW" : "CLOSED";

// Pick two signals based on ID
const signalsFromId = (id) =>
  [
    SIGNALS[id % SIGNALS.length],
    SIGNALS[(id + 2) % SIGNALS.length],
  ].filter((v, i, a) => a.indexOf(v) === i);

// Decide whether the subject is a person or company
const subjectNameFrom = ({ userId, id }) =>
  userId % 2 === 0
    ? COMPANIES[(id + userId) % COMPANIES.length]
    : `${PEOPLE_FIRST[(userId + id) % PEOPLE_FIRST.length]} ${
        PEOPLE_LAST[(id * 7) % PEOPLE_LAST.length]
      }`;

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

/*
  Pure transformer:
  Given a JSONPlaceholder post, deterministically build a "case".
  This is easy to unit test (no network, no Redux).
*/
export function buildCaseFromPost(post) {
  const id = post.id;
  const subjectName = subjectNameFrom(post);
  const riskCategory = riskCategoryFromId(id);
  const status = statusFromId(id);
  const riskScore = (id * 13) % 101;
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
      // Call a public REST API (pretend this is Quantifind backend)
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const posts = await res.json();

      // Convert raw posts into risk cases
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
  items: [],              // all cases
  selectedCaseId: null,   // which case is selected
  statusFilter: "ALL",    // ALL / OPEN / REVIEW / CLOSED
  isLoading: false,       // API in progress?
  error: null,            // API error message
};

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
      state.selectedCaseId = action.payload;
    },

    // User changes filter
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
  },

  // Async lifecycle handlers
  extraReducers: (builder) => {
    builder
      // API call started
      .addCase(fetchCases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // API call succeeded
      .addCase(fetchCases.fulfilled, (state, action) => {
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

// Export reducer for the Redux store
export default casesSlice.reducer;

/*
  SELECTORS (Refresh):
  Components use useSelector() with these.
  When state changes, React re-renders automatically.
*/
const S = (state) => state.cases;

export const selectSelectedCaseId = (state) =>
  S(state).selectedCaseId;

export const selectStatusFilter = (state) =>
  S(state).statusFilter;

export const selectIsLoading = (state) =>
  S(state).isLoading;

export const selectError = (state) =>
  S(state).error;

export const selectSelectedCase = (state) =>
  S(state).items.find(
    (c) => c.id === S(state).selectedCaseId
  ) || null;

export const selectVisibleCases = (state) =>
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
