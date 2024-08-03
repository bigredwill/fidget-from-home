import React, { useEffect, useRef, useState } from "react";
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
  const [socketConnected, setSocketConnected] = useState(true);

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
      friction: 0.99,
    });
    spinnerBodyRef.current = spinnerBody;

    World.add(engine.world, [spinnerBody]);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      let deltaY = currentScrollY - lastScrollY;
      const torque = deltaY * 0.1;
      let newAngularVelocity = spinnerBody.angularVelocity + torque;

      // If the angular velocity is less than 0.8, quickly set it to 0
      if (Math.abs(newAngularVelocity) < 0.8) {
        newAngularVelocity = 0;
      }

      newAngularVelocity = Math.max(-5, Math.min(newAngularVelocity, 5));

      // Remove clamping logic to allow full range of angular velocity
      Body.setAngularVelocity(spinnerBody, newAngularVelocity);

      lastScrollY = currentScrollY;
    };

    const scrollLoop = () => {
      handleScroll();

      // Check if the user is at the top or bottom of the page
      if (
        window.scrollY < 200 ||
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
      ) {
        // Reset scroll position to the middle
        window.scrollTo(0, document.body.scrollHeight / 2);
        lastScrollY = window.scrollY;
      }

      requestAnimationFrame(scrollLoop);
    };

    scrollLoop();

    return () => {
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
        let currentAngularSpeed = parseFloat(
          Body.getAngularVelocity(spinnerBodyRef.current).toFixed(2)
        );

        // Clamp the angular speed between 2 and 5
        if (currentAngularSpeed > 1) {
          currentAngularSpeed = Math.max(2, Math.min(currentAngularSpeed, 5));
        }

        // Display the angular speed as 0 to 5 in the UI
        angVelText.innerHTML = currentAngularSpeed.toFixed(2);

        // Send message if angular speed changes
        if (currentAngularSpeed !== lastAngularSpeedRef.current) {
          socketManagerRef.current?.sendMessage(
            "fidget-spinner-web",
            `${currentAngularSpeed.toFixed(2)}`
          );
          setSocketConnected(socketManagerRef.current?.isOpen() ?? false);
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
        {!socketConnected && (
          <div
            className="callout"
            style={{
              position: "fixed",
              left: "0",
              right: "0",
              bottom: "0",
              top: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <div
              className="callout-content"
              style={{
                padding: "4vw",
                background: "rgba(0,0,0,0.8)",
                color: "white",
              }}
            >
              You have been disconnected from the Fidget Spinner.
              <br />
              Please refresh the page to continue spinning.
            </div>
          </div>
        )}
        <p>
          Angular Velocity: <span id="angular-velocity">0</span>
        </p>
        <p>Scroll up or down to fidget.</p>
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
      <a
        href="https://simons.dev"
        style={{ color: "white", position: "fixed", zIndex: 20, left: 4, bottom: 4 }}
      >
        <small>https://simons.dev</small>
      </a>
    </div>
  );
};

export default FidgetSpinner;

// Outside of React for better performance
let lastScrollY = window.scrollY;
