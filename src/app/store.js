// This file creates the SHARED NOTEBOOK for the whole app.
// Everything important that multiple screens need lives here (through the slice).
// SADRR: S=store (shared notebook), A=actions exist in slice, D=dispatch used in UI, R=rules live in slice, R=screen updates via useSelector
// SADRR: S=central Redux store (single cases slice).
//
// Resume Bullet Mapping:
// Resume Bullet #1: Redux Toolkit store is configured with a cases slice reducer
import { configureStore } from "@reduxjs/toolkit";
import casesReducer from "../features/cases/casesSlice";

// INTERVIEW: SINGLE STORE (single source of truth).
// LAYMAN: This is the ONE shared notebook that the whole app reads/writes.
// LAYMAN: If we did not have this, each screen would have its own copy and they would not match.
export const store = configureStore({ reducer: { cases: casesReducer } });

