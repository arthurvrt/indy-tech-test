# Promo Code API

The Promo Code API is a simple Node.js application designed to facilitate the creation and validation of promo codes. Below, you'll find instructions on how to set up, install dependencies, and use the API effectively.

## Installation

Clone indy-tech-test repository and install the dependencies:

```bash
git clone indy-tech-test
cd indy-tech-test
npm install
```

Node version v20.10.0

Make sure to obtain your own API key for the [OpenWeather API](https://home.openweathermap.org/users/sign_in)
API, which is required for the proper functioning of the application.

## Usage

The application exposes two endpoints:

- `POST /promocode/create`: This endpoint is used to create a new promo code. The request body should contain the promo code details.
- `POST /promocode/use`: This endpoint is used to use a promo code. The request body should contain the promo code to be validated.

To start the server, run:
`npm start`

The server will start on the port specified in your environment variables, or 3000 by default.

## What would you have done to improve your test if you'd had more time?

- Joi input checking for creation input
- Input testing
- In depth testing, more cases for validationLogic
- Unit test for each function (dateRule, ageRule, etc)
