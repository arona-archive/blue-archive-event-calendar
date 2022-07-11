#!/bin/bash

set -ex

export GOOGLE_APIS_TOKEN=$(cat ./token.json)
export GOOGLE_APIS_CREDENTIALS=$(cat ./credentials.json)

npm start
