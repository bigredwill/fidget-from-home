import React, { useEffect } from "react";
import Spinner from "./assets/fidget.svg";

const FidgetSpinner: React.FC = () => {
  useEffect(() => {
    const socket = new WebSocket("ws://your-server-address");

    const spinFidgetSpinner = () => {
      console.log("spin");
      // Send message when the user scrolls
      socket.send(JSON.stringify({ action: "spin", speed: 10 })); // Example message
    };

    const addFakeElement = () => {
      const fakeElement = document.createElement("div");
      fakeElement.style.height = "2000px";
      fakeElement.style.width = "100vw";
      fakeElement.style.display = "block";
      fakeElement.className = "fake-element";
      document.body.appendChild(fakeElement);
    };

    const removeFakeElements = () => {
      const fakeElements = document.querySelectorAll(".fake-element");
      if (fakeElements.length > 200) {
        fakeElements.forEach((element) => element.remove());
      }
    };

    const handleScroll = () => {
      spinFidgetSpinner();
      removeFakeElements();
      addFakeElement();
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial fake element to start the infinite scroll
    addFakeElement();

    // Cleanup event listener and remove fake elements on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      socket.close();
      removeFakeElements();
    };
  }, []);

  return (
    <div id="spinner">
      <Spinner />
    </div>
  );
};

export default FidgetSpinner;
