CaseFlow

CaseFlow is a simple React + Redux case-triage dashboard built to demonstrate clear, predictable state management using the SADRR pattern.

This project intentionally focuses on fundamentals rather than feature depth. The goal is to show how shared application state flows through a modern frontend application in a way that is easy to reason about and easy to explain.

Core Concept: SADRR

CaseFlow is built around a simple Redux mental model called SADRR:

S — State

A — Action

D — Dispatch

R — Reducer

R — Refresh (React re-render)

This loop describes the entire lifecycle of data in the application.

SADRR Explained (Layman Terms)
State

All shared data lives in one place: the Redux store.

Examples include:

List of cases

Selected case

Active filters

Loading status

State represents the current truth of the application.

Action

Actions describe what happened.

Examples include:

A case was selected

Cases were loaded from an API

A filter was changed

Actions do not change data directly. They only describe events.

Dispatch

Components send actions to Redux using dispatch.

Dispatch is how the UI requests a change to the application state.

Reducer

Reducers define how state changes in response to actions.

They:

Receive the current state

Receive an action

Return a new updated state

Reducers are predictable and contain no side effects.

Refresh (React re-render)

When Redux state changes, React automatically re-renders any components that depend on that state.

No manual UI updates are required.

Application Flow

User interaction
→ React component
→ dispatch(action)
→ Redux reducer
→ Redux state updates
→ React re-renders UI

Project Structure
src/app/store.js

Creates the Redux store and acts as the single source of truth.

src/features/cases/casesSlice.js

Defines case-related state, actions, and reducers.

src/components/CaseList.jsx

Displays the list of cases and dispatches selection actions.

src/components/CaseDetails.jsx

Displays details for the currently selected case.

src/components/CaseFilters.jsx

Allows filtering cases and dispatches filter updates.

src/App.jsx

Handles layout and component composition.

src/main.jsx

Connects React to Redux using the Provider.

Redux vs React State
Redux (Shared State)

Case list

Selected case

Filters

Loading and error state

React Component State (UI-only)

Input values

Temporary UI interactions

Modal open/close state

Rule of thumb:
If multiple components need the data, it belongs in Redux.

Why This Project Exists

CaseFlow mirrors simplified investigation and triage workflows commonly found in risk, compliance, and analytics platforms.

The domain is intentionally simple so the focus stays on:

Centralized state

Predictable updates

Clear separation of concerns

Automatic UI synchronization

Tech Stack

React

Redux Toolkit

React Redux

JavaScript (ES6+)

Vite or Next.js

Vercel for deployment

Getting Started

Install dependencies using your preferred package manager, then start the development server.

Open the local development URL in your browser to view the app.

Deployment

CaseFlow is designed to be easily deployed on Vercel.

The application requires no backend services and can be deployed as a static frontend.

Final Note

CaseFlow is intentionally small.

Every file and interaction exists to reinforce the SADRR mental model and demonstrate how Redux and React work together to manage shared application state in a clean and predictable way.