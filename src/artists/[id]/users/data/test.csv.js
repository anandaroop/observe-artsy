#! /usr/bin/env node

import { sql, redshift } from "../../../../lib/db.js";

const query = sql`
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
`;

const result = await redshift(query);

console.log(result.csv);
