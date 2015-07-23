#!/bin/bash


node ../../../../../tiddlywiki.js \
	./demoedit \
	--verbose \
	--server 8098 $:/core/save/all \
	|| exit 1


