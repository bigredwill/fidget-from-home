import React, { useState, useEffect } from "react";
import FidgetSpinner from "./fidget-spinner";
import "./app.css";

export function App() {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Show modal on initial load
    setShowModal(true);
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const closeModal = () => {
    setShowModal(false);
    document.body.classList.remove("no-scroll");
  };

  return (
    <>
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "500px",
            textAlign: "left",
            color: 'black',
          }}>
            <h5>Fidget from a distance</h5>
            <p>Remote actuated fidgeting is far safer for the general public than spinning an actual fidget spinner.</p>
            <p>We live in a world where actions and their effects are often separated by physical distance but connected through digital means.</p>
            <p>Please use caution while scrolling.</p>
            <button onClick={closeModal} style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}>Let me spin.</button>
          </div>
        </div>
      )}
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