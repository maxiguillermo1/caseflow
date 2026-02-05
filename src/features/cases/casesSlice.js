// SADRR: S=cases state, A=actions + fetchCases thunk, R=reducers.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Deterministic "microservice" -> case shaping (no randomness).
const PEOPLE_FIRST = ["Alex", "Jordan", "Sam", "Taylor", "Morgan"];
const PEOPLE_LAST = ["Ng", "Patel", "Garcia", "Kim", "Johnson"];
const COMPANIES = ["Northstar Trading", "Blue Harbor LLC", "Orchid Ventures"];
const SIGNALS = ["Sanctions match", "Adverse media", "High-risk jurisdiction", "Rapid account turnover", "Unusual transaction pattern"];
const REASONS = ["unusual transaction patterns inconsistent with prior activity", "identity information that does not fully match available records", "counterparties linked to high-risk geographies", "a sudden spike in volume and velocity over a short period", "payment behavior that resembles known fraud typologies"];
const MAX_VISIBLE = 30;

const riskCategoryFromId = (id) => (id % 3 === 0 ? "AML" : id % 3 === 1 ? "KYC" : "FRAUD");
const statusFromId = (id) => (id % 3 === 0 ? "OPEN" : id % 3 === 1 ? "REVIEW" : "CLOSED");
const signalsFromId = (id) => [SIGNALS[id % SIGNALS.length], SIGNALS[(id + 2) % SIGNALS.length]].filter((v, i, a) => a.indexOf(v) === i);
const subjectNameFrom = ({ userId, id }) =>
  userId % 2 === 0
    ? COMPANIES[(id + userId) % COMPANIES.length]
    : `${PEOPLE_FIRST[(userId + id) % PEOPLE_FIRST.length]} ${PEOPLE_LAST[(id * 7) % PEOPLE_LAST.length]}`;
const englishSummary = ({ subjectName, riskCategory, status, riskScore, signals, id }) =>
  `Investigation note: ${subjectName} was flagged for ${riskCategory} triage due to ${REASONS[id % REASONS.length]}. Current status is ${status} with a risk score of ${riskScore}/100.${signals.length ? ` Signals observed: ${signals.join(", ")}.` : ""}`;

export const fetchCases = createAsyncThunk(
  "cases/fetchCases",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const posts = await res.json();

      return posts.map((post) => {
        const id = post.id;
        const subjectName = subjectNameFrom(post);
        const riskCategory = riskCategoryFromId(id);
        const status = statusFromId(id);
        const riskScore = (id * 13) % 101;
        const signals = signalsFromId(id);
        return { id, subjectName, riskCategory, status, riskScore, signals, summary: englishSummary({ subjectName, riskCategory, status, riskScore, signals, id }) };
      });
    } catch (err) {
      return rejectWithValue(err?.message ?? "Failed to fetch cases");
    }
  },
);

const initialState = {
  items: [],
  selectedCaseId: null,
  statusFilter: "ALL",
  isLoading: false,
  error: null,
};

const casesSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {
    selectCase(state, action) {
      state.selectedCaseId = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        // Keep selection sensible after refresh.
        if (!state.items.some((c) => c.id === state.selectedCaseId)) {
          state.selectedCaseId = state.items[0]?.id ?? null;
        }
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error?.message || "Unknown error";
      });
  },
});

export const { selectCase, setStatusFilter } = casesSlice.actions;
export default casesSlice.reducer;

// Selectors (Refresh): components useSelector() these for UI updates.
const S = (state) => state.cases;
export const selectSelectedCaseId = (state) => S(state).selectedCaseId;
export const selectStatusFilter = (state) => S(state).statusFilter;
export const selectIsLoading = (state) => S(state).isLoading;
export const selectError = (state) => S(state).error;
export const selectSelectedCase = (state) => S(state).items.find((c) => c.id === S(state).selectedCaseId) || null;
export const selectVisibleCases = (state) => (S(state).statusFilter === "ALL" ? S(state).items : S(state).items.filter((c) => c.status === S(state).statusFilter)).slice(0, MAX_VISIBLE);
export const selectVisibleCount = (state) => selectVisibleCases(state).length;
export const selectStatusCounts = (state) =>
  S(state).items.reduce((a, c) => ((a[c.status] = (a[c.status] || 0) + 1), a), { OPEN: 0, REVIEW: 0, CLOSED: 0 });

