#!/bin/bash


node ../../../../../tiddlywiki.js \
	./demoedit \
	--verbose \
	--server 8078 $:/core/save/all \
	|| exit 1


