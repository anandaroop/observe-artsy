export REDSHIFT_HOST=REPLACE
export REDSHIFT_PORT=REPLACE
export REDSHIFT_DB=REPLACE
export REDSHIFT_USER=REPLACE

# locally, will use 1password to inject the password into the env
ONE_PASSWORD_REDSHIFT_ITEM="REPLACE"
export PGPASSWORD=$(op item get "${ONE_PASSWORD_REDSHIFT_ITEM}" --fields "${REDSHIFT_USER}")
