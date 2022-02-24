#!/bin/bash

set -e

if [[ -f .env ]]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

npm run sync
