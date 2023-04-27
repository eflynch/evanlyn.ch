#!/usr/bin/env bash
cat ../public/trunk.mgl | ../../cli/magnolia2html --out ../public/ --base-href $1
