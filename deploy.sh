#!/bin/bash

rsync app/* eflynch.github.io/
cd eflynch.github.io
git add --all
git commit -m "Deploying: see eflynch/evanlyn.ch for meaningful versioning"
git push origin master

