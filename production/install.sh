#!/bin/sh
DOCDIR=/data/html/805/bootcamp
echo "Extract files"
tar xvfz dist.tgz -C $DOCDIR >/dev/null 2>&1
echo "Achive dist.tgz"
cp dist.tgz ~/805/archive/dist_`date +%Y%m%d_%H%M%S`.tgz
echo "Install node modules"
cd $DOCDIR && npm install --production
echo "DONE!"
