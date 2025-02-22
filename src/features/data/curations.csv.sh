#! /bin/sh

QUERY=$(cat <<EOF
SELECT
  mca.created_at AS curated_at,
  to_char(mca.created_at, 'yyyy-mm-dd') AS curation_date,
  a.id AS artist_id,
  a.slug AS artist_slug,
  a.name AS artist_name,
  w.id AS artwork_id,
  w.slug AS artwork_slug,
  w.title AS artwork_title,
  w.artist_id AS artwork_artist_id,
  w.partner_id AS artwork_partner_id,
  w.category AS artwork_category,
  w.attribution_class AS artwork_attribution_class,
  w.availability AS artwork_availability,
  w.published_at AS artwork_published_at,
  w.thumbnail_url AS artwork_thumbnail_url,
  w."date" AS artwork_date,
  mc.id AS collection_id,
  mc.slug AS collection_slug,
  mc.title AS collection_title,
  mc.category AS collection_category,
  mc."type" AS collection_type
FROM
  gravity.marketing_collection_artworks mca
  LEFT JOIN gravity.artworks w ON w.id = mca.artwork_id
  LEFT JOIN gravity.artists a ON a.id = w.artist_id
  LEFT JOIN gravity.marketing_collections mc ON mc.id = mca.marketing_collection_id
WHERE
  w.published IS TRUE
  AND mc.published IS TRUE
  AND mca.created_at >= CURRENT_TIMESTAMP - INTERVAL '14 days'
ORDER BY
  curation_date desc,
  collection_title asc
EOF
)

psql -c "${QUERY}" --csv
