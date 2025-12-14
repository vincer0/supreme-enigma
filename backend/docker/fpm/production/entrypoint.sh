#!/bin/sh
set -e

# Initialize storage directory if empty
# -----------------------------------------------------------
# If the storage directory is empty, copy the initial contents
# and set the correct permissions.
# -----------------------------------------------------------
echo "Executing entrypoint production..."

echo "Checking storage directory..."
if [ ! "$(ls -A /var/www/storage)" ]; then
  echo "Initializing storage directory..."
  cp -R /var/www/storage-init/. /var/www/storage
  chown -R www-data:www-data /var/www/storage
fi

echo "Storage directory is ready."
echo ""
echo "Removing storage-init directory..."
echo ""
# Remove storage-init directory
rm -rf /var/www/storage-init

# Run Laravel migrations
# -----------------------------------------------------------
# Ensure the database schema is up to date.
# -----------------------------------------------------------
echo "Migrating database..."
echo ""
php artisan migrate --force
echo "Migrating database completed."

# Clear and cache configurations
# -----------------------------------------------------------
# Improves performance by caching config and routes.
# -----------------------------------------------------------
echo "Caching configurations..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

# Run the default command
echo "Starting the application..."
exec "$@"