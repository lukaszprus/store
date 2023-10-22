# Store

## Node version

Using node v16.20.1 (npm v8.19.4). If you use nvm (node version manager) run `nvm use` to pick up the version from the `.nvmrc` file.

## Dependencies

Run `npm i` to install dependencies.

## API server

Run `npx json-server db.json --routes routes.json` to start API.

## Development server

Run `npm start` or `npx ng s` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` or `npx ng b` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` or `npx ng t` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Linting

Run `npm run lint` or `npx ng lint` to lint files.
