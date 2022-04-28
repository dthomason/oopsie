<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [<div style="font-size: 56px; color: #387FCF; margin-left: 4px"> Oopsie </div><div style=" font-size: 36px; margin-left: 12px">¯\\\_(ツ)_/¯</div><div>The Forgetter's Getter</div>](#div-stylefont-size-56px-color-387fcf-margin-left-4px-oopsie-divdiv-style-font-size-36px-margin-left-12px_ツ_divdivthe-forgetters-getterdiv)
- [Getting Started](#getting-started)
    - [Before You Begin:](#before-you-begin)
    - [Installing](#installing)
  - [Configuring your Environment:](#configuring-your-environment)
    - [Twilio](#twilio)
    - [NGrok](#ngrok)
    - [API - Express node js](#api---express-node-js)
    - [APP - React Native](#app---react-native)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

#  <div style="font-size: 56px; color: #387FCF; margin-left: 4px"> Oopsie </div><div style=" font-size: 36px; margin-left: 12px">¯\\\_(ツ)_/¯</div><div>The Forgetter's Getter</div>

# Getting Started

### Before You Begin:

- The Database used for this project was a [postgres](https://www.postgresql.org/docs/current/tutorial-install.html) server so if you don't have one available we recommend you install one now

- X-Code is required

### Installing

- Pull down this repository and `cd` into the root directory

- Copy the `.env.example` file

```bash
cp .env.example .env
```

- open the .env file

## Configuring your Environment:

### Twilio

This app utilizes Twilio for it's `Passwordless Auth` verification process as well as the `Dial-By-Name` service.  In order to at least have the api running for Auth you will need to have at least a [free trial Twilio account](https://www.twilio.com/try-twilio).
  - Passwordless Auth
    - VERIFY_SERVICE_SID: click [here](https://www.twilio.com/docs/verify/quickstarts/node-express) for how to set that up.
  - Dial-by-Name (Optional): requires setting up a TWIML app with ngrok
    - TWILIO_NUMBER
    - TWILIO_ACCOUNT_SID
    - TWILIO_AUTH_TOKEN

### NGrok

Ngrok provides a way for Twilio to communicate with your local dev environment by providing a public url that is tunneled to your local running server.  We configured it to automatically update Twilio with that url so there is no need to worry about manually copy and pasting the dynamic value ngrok provides.

- You will need a `NGROK_TOKEN` which you can get for free by signing up [here](https://dashboard.ngrok.com/get-started/setup)

- paste the token in the `.env` file

### API - Express node js

```bash
cd api
yarn install
yarn dev
```

- If Twilio was configured correctly you should see something like the following:

```bash
Server now available at https://079c-73-185-58-123.ngrok.io
Successfully updated Twilio voiceUrl to https://079c-73-185-58-123.ngrok.io/api/voice/gather
2022-04-28 04:30:34.837  INFO  🚀 Server ready at: http://localhost:3030
```

### APP - React Native

- If you have never ran X-Code locally before you'll need to make take the time to make sure you have a working xcode environment that builds correctly.

```bash
cd app
yarn install
yarn ios
```

- if everything is configured correctly the simulator should pop up for you and and app will load momentarily.
