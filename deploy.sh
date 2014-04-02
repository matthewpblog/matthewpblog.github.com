#/bin/bash

SERVER=$1

rsync -avz dist/ $SERVER:www/mpinfo/
