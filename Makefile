deploy:
	aws s3 sync public s3://matthewphillips.info
.PHONY: deploy
