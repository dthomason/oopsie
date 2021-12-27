# OOPSIE
## The Forgetter's Getter

## Getting Started In Local Dev

### Requirements

- postgres database installed and accessible
- - I use a local one but you're welcome to use a docker image if that is what you prefer.

- NGROK configured locally before starting the api server.

- XCode and fully working ios Simulator for the app.

### Configuring NGrok

- To allow Twilio to reach your local dev api during development you must run [Ngrok](https://dashboard.ngrok.com/get-started/setup).
- After you've followed the doc to install place the `ngrok` file into the `./node_api/bin/` folder. You may have to create the bin folder if you don't already have one. It's gitignored.
-
- Before you can begin using ngrok you must register the token first
  `./bin/ngrok authtoken ${NGROK_TOKEN}`

- the following will route ngroks public url to your local api
  `yarn workspace node_api ngrok`

- you then take note of the url ngrok gives you back and enter those into the webhook configuration in Twillio's dashboard.
## Running the App

### API - Express node js
- make sure you followed the ngrok setup above.

- `yarn install`

- `yarn workspace node_api dev`

- Should show success and listening on localhost:3030

### APP - React Native
- if you have never ran xcode locally before you'll need to make take the time to make sure you have a working xcode environment that builds correctly.
- `cd ./app`
- `yarn install`
- `yarn ios`
- if everything is configured correctly the simulator should pop up for you and and app will load momentarily.
