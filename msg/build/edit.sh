#!/bin/bash


node ../../../../../tiddlywiki.js \
	./demoedit \
	--verbose \
	--server 8099 $:/core/save/all \
	|| exit 1


