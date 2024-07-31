import React, { useEffect, useRef } from "react";
import Spinner from "./assets/fidget.png";
import { Engine, World, Bodies, Body } from "matter-js";

const FidgetSpinner: React.FC = () => {
  const spinnerRef = useRef<HTMLImageElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const spinnerBodyRef = useRef<Body | null>(null);

  useEffect(() => {
    // Initialize Matter.js engine and world
    const engine = Engine.create();
    engineRef.current = engine;

    // Create spinner body
    const spinnerBody = Bodies.rectangle(200, 200, 100, 100, {
      density: 1.0,
      friction: 0.3,
    });
    spinnerBodyRef.current = spinnerBody;

    World.add(engine.world, [spinnerBody]);

    const socket = new WebSocket("ws://your-server-address");

    const spinFidgetSpinner = () => {
      console.log("spin");
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
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      const torque = deltaY * 0.0001; // Adjust the multiplier for desired sensitivity
      Body.setAngularVelocity(spinnerBody, spinnerBody.angularVelocity + torque);
      lastScrollY = currentScrollY;
      spinFidgetSpinner();
      removeFakeElements();
      addFakeElement();
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener and close socket on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      socket.close();
    };
  }, []);

  useEffect(() => {
    const updateRotation = () => {
      if (engineRef.current && spinnerBodyRef.current && spinnerRef.current) {
        Engine.update(engineRef.current, 1000 / 60);
        const angle = spinnerBodyRef.current.angle * (180 / Math.PI); // Convert radians to degrees
        spinnerRef.current.style.transform = `rotate(${angle}deg)`;
      }
      requestAnimationFrame(updateRotation);
    };

    updateRotation();
  }, []);

  return (
    <div className="spinnerWrapper">
      <img
        ref={spinnerRef}
        className="spinnerImg"
        width="40vw"
        style={{
          display: "block",
        }}
        src={Spinner}
      />
    </div>
  );
};

export default FidgetSpinner;

// Outside of React for better performance
let lastScrollY = window.scrollY;