
# Spotify-API
# Folder Structure

src
│   main.ts         # Application entry point
└───api             # Express route controllers for all the endpoints of the app
└───config          # Environment variables and configurations
└───loaders         # Split the startup process into modules
└───models          # TypeORM Entities
└───services        # All the business logic is here
└───types           # Type declaration files (d.ts) for Typescript

# Getting Started
# Step 1: Set up the Development Environment
You need to set up your development environment before you can do anything.

Install Node.js and NPM

on OSX use homebrew brew install node
on Windows use chocolatey choco install nodejs
# Install
Install all dependencies with npm install
# Running 
Run npm  start
The server address will be displayed to you as http://0.0.0.0:8082
# Building the project and run it
Run yarn build to generated all JavaScript files from the TypeScript sources.
the builded app located in dist.
Inspired by Bulletproof Node.js architecture with modificatins
