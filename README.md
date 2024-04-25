# Donor App

### * This readme file is not complete *

Required node version: >= 14

## Install

1. Create DB - cfg

2. clone app (donor-app server and client)

4. nvm env config client/server (node_env set to production)

4. npm install 
  - from project root, run "npm i"
  - from /client folder, run "npm i"

5. Private images - create folder and upload signature image file and letter header file to /img/private folder

6. build client
  - from /client folder, run "npm run build"

7. If application is not running at domain root (i.e. app is accessed via a relative path from the domain root) update the following paths in 'client/public/index.html':

  a. <link rel='icon' type='image/png' href='{/PATH_TO_APP}/favicon.png'>

  b. <link rel='stylesheet' href='{/PATH_TO_APP}/build/bundle.css'>

  c. <script defer src='{/PATH_TO_APP}/build/bundle.js'></script>

# Client Run dev (webpack dev server)

1. client: from /, npm run client

2. client dev and (prod|dev) server: from /, npm run dev

# Client run prod (Must build project with npm build from /client folder)

1. client only: from /client, npm run start (app runs on port set in .env)

2. client and server: from /, npm run start (app runs on port set in .env)

# Updates

1. To update client dev server app port, set --port flag in client/package.json 'dev' (or current run) scripts

2. webpack.config.js Added Dotenv library

3. webpack.config.js Added devServer {} public setting via .env (server domain for webpack 'allowed hosts')

## Client

#### RUNTIME_ENV

The Node runtime environment. Options:

### Environment settings

##### 'production':

1. Request data is compressed
2. Session token validated with each request to the server

##### 'testing':

1. No data compression
2. Session token validated with each request to the server

##### 'development':

1. No data compression
2. No session token validation

## Server

### Environment settings

#### RUNTIME_ENV

The Node runtime environment. Options:

##### 'production':

1. Request data is compressed
2. Session token validated with each request to the server

##### 'development':

1. No data compression
2. No session token validation
