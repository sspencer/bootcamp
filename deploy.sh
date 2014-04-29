#!/bin/sh

grunt build
tar cvfz dist.tgz app.js bootcamp.js config.js package.json server dist 
scp dist.tgz mud:
ssh mud "805/install.sh"
