// SADRR: S=central Redux store (single cases slice).
import { configureStore } from "@reduxjs/toolkit";
import casesReducer from "../features/cases/casesSlice";

// INTERVIEW: SINGLE STORE (single source of truth).
export const store = configureStore({ reducer: { cases: casesReducer } });

