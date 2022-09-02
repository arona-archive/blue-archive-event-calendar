#!/bin/bash

set -ex

git add .

if [[ -z $(git status --porcelain) ]]; then
	exit 0
fi

git commit -m "update notices.json"
git push
