#! /bin/sh

UPDATE_ME=0

QUERY=$(cat <<EOF
SELECT
  cfsa.facet,
  cfsa.query,
  cfsa.sent_at,
  cfsa.context_page_path,
  cfsa.context_page_search,
  -- cfsa.context_page_referrer,
  -- cfsa.context_page_url,
  cfsa.context_ip,
  cfsa.context_locale,
  cfsa.context_timezone,
  u.city,
  u.state,
  u.country,
  u.id,
  u.roles
FROM
  force_production.commercial_filter_selected_all cfsa
  LEFT JOIN gravity.users u ON u.id = cfsa.user_id
WHERE
  sent_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
  and facet = 'locationCities'
;
EOF
)

psql -h "${REDSHIFT_HOST}" -p "${REDSHIFT_PORT}" -d "${REDSHIFT_DB}" -U "${REDSHIFT_USER}" -c "${QUERY}" --csv
