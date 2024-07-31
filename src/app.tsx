import { useState } from "preact/hooks";
import FidgetSpinner from "./fidget-spinner";
import "./app.css";

export function App() {
  return (
    <div className='app'>
      <FidgetSpinner />
    </div>
  );
}
