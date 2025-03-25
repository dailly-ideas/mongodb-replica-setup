FROM mongo:7.0

COPY mongodb.keyfile /etc/mongodb.keyfile

RUN chown mongodb /etc/mongodb.keyfile && chmod 400 /etc/mongodb.keyfile

CMD ["mongod", "--replSet", "rs0", "--auth", "--keyFile", "/etc/mongodb.keyfile", "--bind_ip_all"]
