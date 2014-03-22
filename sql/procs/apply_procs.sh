#!/bin/bash
for f in *.sql
do
    echo "==== $f ===="
    cat $f | mysql -u root bootcamp
done
