import pg from "pg";
import sql from "sql-template-tag";
import { csvFormat } from "d3-dsv";

const redshift = async (query) => {
  // setup
  const client = new pg.Client({ ssl: { rejectUnauthorized: false } });
  await client.connect();

  // query
  const result = await client.query(query);
  const csv = csvFormat(result.rows);

  // teardown
  await client.end();

  return { ...result, csv };
};

export { sql, redshift };
