#!/bin/bash
if [[ -n $* ]]; then
    PROVIDERS="$*"
else
    PROVIDERS=""
    for file in $CHANGED_FILES; do
        CHANGED_PROVIDER=`echo $file | sed -E "s/providers\/([A-z]+)\/.+/\1/g"`
        if [[ -n "$PROVIDERS" ]]; then
            PROVIDERS="$PROVIDERS,"
        fi
        PROVIDERS="$PROVIDERS$CHANGED_PROVIDER"
    done
fi
if [[ -z "$PROVIDERS" ]]; then
    echo "No provider was updated"
    exit 1
fi
./generate.sh --providers "$PROVIDERS"
