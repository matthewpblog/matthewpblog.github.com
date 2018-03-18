deploy:
	aws s3 sync public s3://matthewphillips.info
.PHONY: deploy

serve:
	http-server -p 5000
.PHONY: serve
