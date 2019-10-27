#!/usr/bin/env bash
#
# This script will push `master` branch to GitHub along with tags, and will
# also create a Release for the latest tag, and upload `dijnet-bot.js`
# bundle file as an asset.
#
# The script must be run after `npm run release` and `npm run bundle`.
#
# Requires `token.sh` file in the current directory which sets TOKEN
# variable for GitHub authorization.
#
# Requires `jq` utility.
#
# Call this script via `npm run github`.

git push --follow-tags origin master

. ./scripts/token.sh
TAG=`git describe`
DATA="{ \"tag_name\": \"$TAG\", \"name\": \"$TAG\" }"
echo "Creating release: $TAG"
UPLOAD_URL=`curl -d "$DATA" -H "Authorization: token $TOKEN" -s -X POST  https://api.github.com/repos/juzraai/dijnet-bot/releases | jq -r .upload_url | cut -d"{" -f 1`
echo "Uploading asset"
curl --data-binary "@dijnet-bot.js" -H "Authorization: token $TOKEN" -H "Content-Type: text/javascript" -s $UPLOAD_URL?name=dijnet-bot.js | jq -r .state
echo "Done"