FROM mongo:7.0

COPY mongodb.keyfile /etc/mongodb.keyfile

# Set proper ownership and permissions for the keyfile
RUN chown mongodb:mongodb /etc/mongodb.keyfile && \
  chmod 400 /etc/mongodb.keyfile && \
  # Create log directory with appropriate permissions
  mkdir -p /var/log/mongodb && \
  chown -R mongodb:mongodb /var/log/mongodb

# Don't override CMD here as it will be specified in docker-compose.yml
