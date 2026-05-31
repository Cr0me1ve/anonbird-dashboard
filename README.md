# AnonBird Dashboard

This project is the UI for AnonBird's management service.

See the [AnonBird fork](https://github.com/Cr0me1ve/netbird).

## Why?

The dashboard makes it easy to operate an anonymous private mesh:

- track peer status without exposing real peer IPs
- manage setup keys for unattended enrollment
- list users and service users
- define access controls
- generate source-build install commands for AnonBird clients

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
5. Run the dashboard without SSL:

   ```shell
   docker run -d --name anonbird-dashboard \
     --rm -p 80:80 -p 443:443 \
     -e AUTH0_DOMAIN=<SET YOUR AUTH DOMAIN> \
     -e AUTH0_CLIENT_ID=<SET YOUR CLIENT ID> \
     -e AUTH0_AUDIENCE=<SET YOUR AUDIENCE> \
     -e NETBIRD_MGMT_API_ENDPOINT=<SET YOUR MANAGEMENT API URL> \
     ghcr.io/cr0me1ve/anonbird-dashboard:main
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
     ghcr.io/cr0me1ve/anonbird-dashboard:main
   ```

## How to run local development

1. Install [Node](https://nodejs.org/)
2. Create and update the `.local-config.json` file. This file should contain values to be replaced from `config.json`.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the development server.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Migration Notes

Replace old dashboard images in your compose files with `ghcr.io/cr0me1ve/anonbird-dashboard:main`, then recreate the dashboard container.
