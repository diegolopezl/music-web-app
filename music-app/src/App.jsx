import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Login from "./components/Login";
import Homepage from "./components/Homepage";

const code = new URLSearchParams(window.location.search).get("code");

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={code ? <Homepage code={code} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
