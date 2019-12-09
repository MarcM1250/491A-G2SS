#!bin/bash

openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout localhost.key \
    -new \
    -out localhost.crt \
    -config ./openssl.cnf \
    -sha256 \
    -days 365