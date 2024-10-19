# Assignment 1 : Rule Engine


This project is a Rule Engine that allows creating, modifying, and evaluating rules based on input data. It uses a frontend React app for the UI and an Express.js backend with MongoDB for rule storage and evaluation.

## Demo
[Screencast from 19-10-24 10:12:29 PM IST.webm](https://github.com/user-attachments/assets/a1417c6d-8f50-4f0f-938c-241330b23cfd)

## Features
- Create new rules by entering rule strings (e.g. : **(age > 30 AND department = "Sales") OR (salary > 50000 AND experience > 5)** ).
- Modify existing rules using an intuitive UI.
- Evaluate rules based on JSON input data and determine eligibility.
- Use JSON-Rules-Engine to evaluate complex conditions.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)

## Setup

1. Clone this repository:
    ```bash
    git clone https://github.com/CulturalProfessor/zeotap.git
    cd rule-engine
    ```
2. Build and run the app using Docker Compose:
    ```bash
    docker-compose up --build
    ```
# Assignment 2 : Weather Monitoring System

This project monitors real-time weather data for multiple cities using the OpenWeatherMap API. It stores aggregated weather data in MongoDB and generates visual summaries (saved as PNG images).

## Demo
[Screencast from 19-10-24 10:19:14 PM IST.webm](https://github.com/user-attachments/assets/7e1b869c-a1de-45f8-b8d0-62a0711a7e93)

## Features

- Real-time weather data fetching.
- Data aggregation (temperature, humidity, wind speed).
- Automatic alerts for high temperatures.
- PNG image visualization of weather summaries.
- Data stored in MongoDB for further analysis.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- OpenWeatherMap API key ([Sign up here](https://openweathermap.org/api)).

## Setup

1. Clone this repository:
    ```bash
    git clone https://github.com/CulturalProfessor/zeotap.git
    cd weather-monitor
    ```

2. Add your OpenWeatherMap API key in the Python script:
    ```python
    API_KEY = "your_api_key_here"
    ```

3. Build and run the app using Docker Compose:
    ```bash
    docker-compose up --build
    ```

## Output
- Weather summaries are stored in MongoDB.
- Visual summaries are saved as PNG images in the working directory.

