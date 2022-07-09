#!/bin/bash

if [[ -f .env ]]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

set -ex

npm run sync
