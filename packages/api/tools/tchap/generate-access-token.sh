#!/bin/bash

MATRIX_ID="${1:-}"
PASSWORD="${2:-}"

HOMESERVER_URL="https://matrix.agent.dinum.tchap.gouv.fr"

if [[ -z "$PASSWORD" ]]; then
    echo "Missing password"
    exit 1
fi

curl -sS -X POST "$HOMESERVER_URL/_matrix/client/v3/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"type\": \"m.login.password\",
        \"password\": \"$PASSWORD\",
        \"identifier\": {
            \"type\": \"m.id.user\",
            \"user\": \"$MATRIX_ID\"
        }
    }"
