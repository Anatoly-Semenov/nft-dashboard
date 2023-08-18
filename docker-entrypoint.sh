#!/bin/sh
cp -R /app_cache/node_modules /usr/src/app/
exec yarn dev
