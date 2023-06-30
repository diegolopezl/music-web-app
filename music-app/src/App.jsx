import { useState } from "react";
import "./App.css";

import Login from "./components/Login";
export default function App() {
  const [count, setCount] = useState(0);

  return <Login />;
}
