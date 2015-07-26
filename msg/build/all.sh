#!/bin/bash

# build TiddlyWiki5 for tiddlywiki.com

# Set up the build output directory

if [  -z "$TW5_BUILD_OUTPUT" ]; then
    TW5_BUILD_OUTPUT=.
fi

if [  ! -d "$TW5_BUILD_OUTPUT" ]; then
    TW5_BUILD_OUTPUT=.
fi

# codemirrordemo.html: wiki to demo codemirror plugin

node ../../../../../tiddlywiki.js \
	./demo \
	--verbose \
--rendertiddlers [!is[system]] $:/core/templates/static.tiddler.html static text/plain\
	|| exit 1


