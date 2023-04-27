#!/bin/bash

cd evanlyn.ch
npm run build
cd scripts
./makenoscript.sh https://evanlyn.ch/
cd ..
cd ..
rsync -r evanlyn.ch/build/* eflynch.github.io/
cd eflynch.github.io
git add --all
git commit -m "Deploying: see eflynch/evanlyn.ch for meaningful versioning"
git push origin master

