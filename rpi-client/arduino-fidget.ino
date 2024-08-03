#include <Adafruit_MotorShield.h>

Adafruit_MotorShield AFMS = Adafruit_MotorShield();
Adafruit_DCMotor *myMotor = AFMS.getMotor(4);

int currentSpeed = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("Adafruit Motorshield v2 - DC Motor test!");

  if (!AFMS.begin()) {
    Serial.println("Could not find Motor Shield. Check wiring.");
    while (1);
  }
  Serial.println("Motor Shield found.");
}

void loop() {
  if (Serial.available() > 0) {
    int input = Serial.parseInt();

    // Check if the input is valid (within range) and ignore zero unless it's deliberately sent
    if (input >= -10 && input <= 10 && !(input == 0 && Serial.read() == -1)) {
      if (input == 0) {
        myMotor->run(RELEASE);
        currentSpeed = 0;
      } else {
        int newSpeed = map(abs(input), 0, 10, 0, 255);
        int newDirection = (input > 0) ? FORWARD : BACKWARD;

        if (currentSpeed != 0 && (input < 0 && currentSpeed > 0 || input > 0 && currentSpeed < 0)) {
          // If changing direction, stop motor for 3 seconds
          myMotor->run(RELEASE);
          delay(3000);
        }

        myMotor->setSpeed(newSpeed);
        myMotor->run(newDirection);
        currentSpeed = (input > 0) ? newSpeed : -newSpeed;
      }

      Serial.print("Set speed to ");
      Serial.print(abs(currentSpeed));
      Serial.print(" and direction to ");
      Serial.println((currentSpeed > 0) ? "FORWARD" : (currentSpeed < 0) ? "BACKWARD" : "STOPPED");
    } else {
      Serial.println("Input out of range (-10 to 10) or zero timeout ignored.");
    }
  }
}
