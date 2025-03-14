#! /usr/bin/env sh

MIN_DATE="2025-03-12"

curl "${SUPABASE_URL}/rest/v1/answers?select=*&created_at=gt.${MIN_DATE}" \
-H "apikey: ${SUPABASE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_KEY}"
