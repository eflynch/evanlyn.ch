#!/usr/bin/env bash

port=${1:-8000}
python3 -m http.server $port &
python -mwebbrowser http://localhost:$port

