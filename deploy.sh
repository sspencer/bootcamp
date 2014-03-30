#!/bin/sh

grunt build
tar cvfz dist.tgz app.js config.js package.json server dist README.md
scp dist.tgz mud:
ssh mud "805/install.sh"
