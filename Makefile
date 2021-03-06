ELEVENTY=node_modules/.bin/eleventy

all: public/programming/atom.xml
PHONY: all

deploy:
	aws s3 sync public s3://matthewphillips.info
.PHONY: deploy

serve:
	http-server -p 5000
.PHONY: serve

docs:
	$(ELEVENTY) --input site --output public
.PHONY: docs

public/programming/atom.xml: public/programming/index.html \
	scripts/programming/src/feed.js
	node scripts/programming/src/feed.js > $@