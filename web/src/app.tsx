import FidgetSpinner from "./fidget-spinner";
import "./app.css";

export function App() {
  return (
    <>
      <div className="app">
        <FidgetSpinner />
      </div>
      <div
        style={{
          height: "4000vh",
          display: "block",
          width: "100%",
        }}
      ></div>
    </>
  );
}
