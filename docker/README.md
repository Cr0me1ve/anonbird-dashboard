# AnonBird Dashboard

AnonBird Dashboard is the management UI for AnonBird self-hosted deployments.

## Tags

`main` is built from the main branch. Release tags use the corresponding fork release version, and tagged releases also publish `latest`.

## How to use this image

HTTP run:

```shell
docker run -d --rm -p 80:80 ghcr.io/cr0me1ve/anonbird-dashboard:latest
```

Using an SSL certificate from Let's Encrypt:

```shell
docker run -d --rm -p 80:80 -p 443:443 \
  -e LETSENCRYPT_DOMAIN=app.mydomain.com \
  -e LETSENCRYPT_EMAIL=hello@mydomain.com \
  ghcr.io/cr0me1ve/anonbird-dashboard:latest
```

## Environment variables

- `NGINX_SSL_PORT` changes the port that Nginx listens to. Defaults to `443`.
- `LETSENCRYPT_DOMAIN` enables Certbot for the specified domain. Defaults to `none`.
- `LETSENCRYPT_EMAIL` email used by Certbot to register the certificate request. Defaults to `example@local`.
