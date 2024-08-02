import React, { useEffect, useRef } from "react";
import Spinner from "./assets/fidget.png";
import { Engine, World, Bodies, Body } from "matter-js";
import "./fidget-spinner.css";
import { WebSocketManager } from "./websocket";

const FidgetSpinner: React.FC = () => {
  const spinnerRef = useRef<HTMLImageElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const spinnerBodyRef = useRef<Body | null>(null);
  const socketManagerRef = useRef<WebSocketManager | null>(null);
  const lastAngularSpeedRef = useRef<number>(0);

  useEffect(() => {
    // Initialize WebSocketManager
    const socketManager = new WebSocketManager();
    socketManagerRef.current = socketManager;
    console.log(socketManager);
  }, []);

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
      let deltaY = currentScrollY - lastScrollY;
      // this is probably not the best, as you can only scroll in one direction.
      // It should also keep track of lastDeltaY so that we continue at same velocity?
      deltaY = Math.max(deltaY, 1);

      const torque = deltaY * 0.0001; // Adjust the multiplier for desired sensitivity
      Body.setAngularVelocity(
        spinnerBody,
        spinnerBody.angularVelocity + torque
      );

      lastScrollY = currentScrollY;
      removeFakeElements();
      addFakeElement();
    };

    addFakeElement();

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener and close socket on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (socketManagerRef.current) {
        socketManagerRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const angVelText = document.querySelector("#angular-velocity");
    const updateRotation = () => {
      if (engineRef.current && spinnerBodyRef.current && spinnerRef.current) {
        Engine.update(engineRef.current, 1000 / 60);
        const angle = spinnerBodyRef.current.angle * (180 / Math.PI); // Convert radians to degrees
        spinnerRef.current.style.transform = `rotate(${angle}deg)`;
      }

      if (angVelText && spinnerBodyRef.current) {
        const currentAngularSpeed = parseFloat(Body.getAngularVelocity(spinnerBodyRef.current).toFixed(2));
        angVelText.innerHTML = currentAngularSpeed.toFixed(2);

        // Send message if angular speed changes
        if (currentAngularSpeed !== lastAngularSpeedRef.current) {
          socketManagerRef.current?.sendMessage(
            "fidget-spinner-web",
            `${currentAngularSpeed.toFixed(2)}`
          );
          lastAngularSpeedRef.current = currentAngularSpeed;
        }
      }
      requestAnimationFrame(updateRotation);
    };

    updateRotation();
  }, []);

  return (
    <div className="spinnerWrapper">
      <div>
        <p>
          Angular Velocity: <span id="angular-velocity">0</span>
        </p>
      </div>
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