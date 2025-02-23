#! /usr/bin/env sh

curl "${SUPABASE_URL}/rest/v1/answers?select=*" \
-H "apikey: ${SUPABASE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_KEY}"
