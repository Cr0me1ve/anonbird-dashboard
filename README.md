# AnonBird Dashboard

This project is the UI for AnonBird's management service.

See the [AnonBird fork](https://github.com/Cr0me1ve/anonbird).

## Why?

The dashboard makes it easy to operate an anonymous private mesh:

- track peer status without exposing real peer IPs
- manage setup keys for unattended enrollment
- list users and service users
- define access controls
- generate source-build install commands and `anonbird://join?...` links for
  AnonBird clients

## Anonymous install flow

Set `ANONBIRD_PEER_MANAGEMENT_ENDPOINT` to the anonymous management URL that
peers should use, for example `http://...onion` or `http://...b32.i2p`. The
dashboard can still call the admin API through `NETBIRD_MGMT_API_ENDPOINT`, but
copied peer commands and setup-key flows will use the anonymous peer endpoint.

When a setup key is available, the UI prefers:

```shell
anonbird join "anonbird://join?server=http%3A%2F%2F...onion&setup_key=...&transport=tor-relay-only"
```

The client validates that management is `.onion` or `.b32.i2p`, enables
anonymous mode, and starts the required local Tor/i2pd runtime automatically
when the clean machine does not already have it running.

## Some Screenshots

<img src="./src/assets/screenshots/peers.png" alt="peers"/>
<img src="./src/assets/screenshots/add-peer.png" alt="add-peer"/>

## Technologies Used

- NextJS
- ReactJS
- Tailwind CSS
- [React Flow](https://reactflow.dev/) for the Control Center
- Auth0
- Nginx
- Docker
- Let's Encrypt

## How to run

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Register an [Auth0](https://auth0.com/) account, or configure another OIDC provider supported by your management service.
3. Set the required authentication environment variables:

   `AUTH0_DOMAIN` `AUTH0_CLIENT_ID` `AUTH0_AUDIENCE`

4. Set `NETBIRD_MGMT_API_ENDPOINT` to your AnonBird management HTTP API. For a local self-hosted deployment this is usually `http://localhost:33071`.
   Set `ANONBIRD_PEER_MANAGEMENT_ENDPOINT` when copied peer install commands
   should use a Tor onion or I2P `.b32.i2p` management URL instead of the admin
   API origin.
5. Run the dashboard without SSL:

   ```shell
   docker run -d --name anonbird-dashboard \
     --rm -p 80:80 -p 443:443 \
     -e AUTH0_DOMAIN=<SET YOUR AUTH DOMAIN> \
     -e AUTH0_CLIENT_ID=<SET YOUR CLIENT ID> \
     -e AUTH0_AUDIENCE=<SET YOUR AUDIENCE> \
     -e NETBIRD_MGMT_API_ENDPOINT=<SET YOUR MANAGEMENT API URL> \
     -e ANONBIRD_PEER_MANAGEMENT_ENDPOINT=<SET YOUR ONION OR B32.I2P URL> \
     ghcr.io/cr0me1ve/anonbird-dashboard:latest
   ```

6. Run the dashboard with SSL:

   ```shell
   docker run -d --name anonbird-dashboard \
     --rm -p 80:80 -p 443:443 \
     -e NGINX_SSL_PORT=443 \
     -e LETSENCRYPT_DOMAIN=<YOUR PUBLIC DOMAIN> \
     -e LETSENCRYPT_EMAIL=<YOUR EMAIL> \
     -e AUTH0_DOMAIN=<SET YOUR AUTH DOMAIN> \
     -e AUTH0_CLIENT_ID=<SET YOUR CLIENT ID> \
     -e AUTH0_AUDIENCE=<SET YOUR AUDIENCE> \
     -e NETBIRD_MGMT_API_ENDPOINT=<SET YOUR MANAGEMENT API URL> \
     -e ANONBIRD_PEER_MANAGEMENT_ENDPOINT=<SET YOUR ONION OR B32.I2P URL> \
     ghcr.io/cr0me1ve/anonbird-dashboard:latest
   ```

## How to run local development

1. Install [Node](https://nodejs.org/)
2. Create and update the `.local-config.json` file. This file should contain values to be replaced from `config.json`.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the development server.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Migration Notes

Replace old dashboard images in your compose files with `ghcr.io/cr0me1ve/anonbird-dashboard:latest`, then recreate the dashboard container.
