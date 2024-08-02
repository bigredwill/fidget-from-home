# WebSocket Client

This project sets up a WebSocket client using Python to listen to messages from a WebSocket relay server at `ws://ws-fidget.cranked.lol`. The client only processes messages of the format `{ sender: "fidget-spinner-relay", content: "1.1" }`.

## Requirements

- Python 3.8 or higher
- Poetry (for dependency management)

## Getting Started

Follow these steps to set up the project and run the WebSocket client:

### 1. Install Poetry

If you haven't installed Poetry yet, you can install it using the following command:

    curl -sSL https://install.python-poetry.org | python3 -

### 2. Clone the Repository

Clone the project repository to your local machine:

`git clone <repository-url>`
`cd <repository-directory>`

### 3. Install Dependencies

Use Poetry to install the project dependencies:

`poetry install`

This command will create a virtual environment and install all the dependencies listed in the `pyproject.toml` file.

### 4. Activate the Virtual Environment

Activate the virtual environment created by Poetry:

`poetry shell`

### 5. Run the Client Script

Run the WebSocket client script:

`python client.py`

## Project Structure

- `client.py`: The main script that connects to the WebSocket server and listens for specific messages.
- `pyproject.toml`: The Poetry configuration file that includes the project dependencies and metadata.

## Adding/Removing Dependencies

To add a new dependency:

`poetry add <package-name>`

To remove a dependency:

`poetry remove <package-name>`

## Deactivating the Virtual Environment

To deactivate the virtual environment, simply exit the shell:

`exit`
