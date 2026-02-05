// SADRR: S=central Redux store (single cases slice).
import { configureStore } from "@reduxjs/toolkit";
import casesReducer from "../features/cases/casesSlice";

export const store = configureStore({ reducer: { cases: casesReducer } });

