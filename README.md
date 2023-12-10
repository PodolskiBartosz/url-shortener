# Url Shortener

This project delivers a frontend angular application for shortening links along with basic user authentication.

This implementation has fulfilled described requirements in doc directory except for analytics.

## Development server

Firstly run `npm install` and then `npm start` to start a dev server. Afterward you can navigate to `http://localhost:4200/` to open the application.

## Unit tests

Due to the time limitation only the login component has been tested.

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Mocking

The mocking directory contains a backend and a database mock, which doesn't represent a productive implementation. 
For the mocking of API endpoints was used Angular HttpInterceptor and for the database the browser's local storage.
The used tools were chosen with goal of quick implementation, as to focus foremost on development of the web application.

## Troubleshooting

If you have any problems with starting the development server, make sure that you have the following tools installed:

- NodeJS ^18.13.0 || ^20.9.0
- Angular CLI (at best current version - 17)
