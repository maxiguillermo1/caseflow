// This file starts the whole app.
// It CONNECTS React to the shared notebook (Redux) so every screen can stay in sync.
// SADRR: S=store (shared notebook), A=actions (events), D=Provider makes dispatch possible, R=rules live in slice, R=screen updates via useSelector
// SADRR: D=Provider "dispatches" store into React tree; R(Refresh)=react-redux wires updates.
//
// Resume Bullet Mapping:
// Resume Bullet #3: Provider wiring enables useDispatch/useSelector across list/filters/details for synced UI
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* INTERVIEW: PROVIDER makes the STORE available to ALL components (DISPATCH + SELECTOR). */}
    {/* LAYMAN: Provider = putting the shared notebook on the table for everyone to use. */}
    {/* LAYMAN: After this, any component can READ shared data (useSelector) or WRITE events (dispatch). */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

