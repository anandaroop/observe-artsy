#! /bin/sh

UPDATE_ME=1

QUERY=$(cat <<EOF
SELECT
    u.email,
    u.name,
    p.path,
    p.sent_at
FROM
    torque_production.pages p
    JOIN gravity.users u ON u.id = p.user_id
WHERE
    sent_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
    AND path <> '/'
    AND path <> '/stats'
    AND name <> 'Roop'
ORDER BY
    p.sent_at desc
;
EOF
)

psql -h "${REDSHIFT_HOST}" -p "${REDSHIFT_PORT}" -d "${REDSHIFT_DB}" -U "${REDSHIFT_USER}" -c "${QUERY}" --csv
