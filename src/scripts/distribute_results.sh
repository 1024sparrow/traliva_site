#!/bin/bash

#echo $1
#echo $2
#touch $1/$2/123

mkdir $1/static
mkdir $1/templates
rm -r $1/static/*
rm -r $1/templates/*
mv $1/$2/images/* $1/static/
mv $1/$2/contrib $1/static/
mv $1/$2/index/input_data/tab_apps $1/static/
mv $1/$2/index/gameplay.js $1/templates/
mv $1/$2/index/index.html $1/templates/
rm -r $1/$2
