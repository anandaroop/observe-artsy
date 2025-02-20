export PGHOST=REPLACE
export PGPORT=REPLACE
export PGDATABASE=REPLACE
export PGUSER=REPLACE

# locally, will use 1password to inject the password into the env
ONE_PASSWORD_REDSHIFT_ITEM="REPLACE"
export PGPASSWORD=$(op item get "${ONE_PASSWORD_REDSHIFT_ITEM}" --fields "${PGUSER}")
