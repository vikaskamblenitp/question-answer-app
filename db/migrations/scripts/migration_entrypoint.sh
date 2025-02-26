#!/usr/bin/env bash

echo "[`date`] Running entrypoint script..."

DSN="postgres://${CONFIG_DB_USER}:${CONFIG_DB_PASSWORD}@${CONFIG_DB_HOST}/${CONFIG_DB_NAME}?sslmode=disable"
DSN_DEFAULT_DB="postgres://${CONFIG_DB_USER}:${CONFIG_DB_PASSWORD}@${CONFIG_DB_HOST}/${CONFIG_DB_NAME}?sslmode=disable"

echo "[`date`] Creating database if it does not exist..."

psql "$DSN_DEFAULT_DB" -tc "SELECT 1 FROM pg_database WHERE datname = '$CONFIG_DB_NAME'" | grep -q || psql "$DSN_DEFAULT_DB" -c "CREATE DATABASE $CONFIG_DB_NAME" 