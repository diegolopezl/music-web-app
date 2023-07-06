import React from "react";
import Header from "./Header";
export default function Home({ userName }) {
  return (
    <section className="center">
      <Header userName={userName} />
      <div className="center-content">This is Home.</div>
    </section>
  );
}
