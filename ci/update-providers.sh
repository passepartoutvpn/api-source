#!/bin/bash
if [[ -n $* ]]; then
    PROVIDERS="$*"
else
    PROVIDERS=""
    for file in $CHANGED_FILES; do
        CHANGED_PROVIDER=`echo $file | sed -E "s/providers\/([A-z]+)\/.+/\1/g"`
        PROVIDERS="$PROVIDERS,$CHANGED_PROVIDER"
    done
fi
./generate.sh --providers "$PROVIDERS"
