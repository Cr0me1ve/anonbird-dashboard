import { StringMap } from "@axa-fr/react-oidc";
import { validator } from "@utils/helpers";

interface Config {
  auth0Auth: boolean;
  authority: string;
  clientId: string;
  clientSecret: string;
  scopesSupported: string;
  apiOrigin: string;
  grpcApiOrigin: string;
  peerManagementEndpoint: string;
  audience: string;
  redirectURI: string;
  silentRedirectURI: string;
  tokenSource: string;
  dragQueryParams: boolean;
  hotjarTrackID?: number;
  googleAnalyticsID?: string;
  googleTagManagerID?: string;
  wasmPath: string;
  releaseCheckEnabled: boolean;
  releaseCheckURL?: string;
  anonbirdSourceURL: string;
  anonbirdDockerImage: string;
}

const fallbackWhenUnset = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  if (value === "" || value.startsWith("$")) return fallback;
  const legacyPackageHost = ["pkgs", "netbird", "io"].join(".");
  if (value.includes(legacyPackageHost)) return fallback;
  return value;
};

/**
 * Load the config from the config.json file
 */
const loadConfig = (): Config => {
  let configJson: any;
  let redirectURI = "/#callback";
  let silentRedirectURI = "/#silent-callback";
  let tokenSource = "accessToken";

  if (process.env.APP_ENV === "test") {
    configJson = require("@/config/test");
  } else if (process.env.NODE_ENV === "development") {
    configJson = require("@/config/local");
  } else if (process.env.NODE_ENV === "production") {
    configJson = require("@/config/production");
  }

  if (configJson.redirectURI) {
    redirectURI = configJson.redirectURI;
  }

  if (configJson.silentRedirectURI) {
    silentRedirectURI = configJson.silentRedirectURI;
  }

  if (configJson.tokenSource) {
    tokenSource = configJson.tokenSource;
  }

  const authority = configJson.authAuthority.replace(/\/+$/, "");

  return {
    auth0Auth: configJson.auth0Auth == "true", // Due to substitution we can't use boolean in the config
    authority: validator.isValidUrl(authority) ? authority : "http://localhost",
    clientId: configJson.authClientId,
    clientSecret: configJson.authClientSecret,
    scopesSupported: configJson.authScopesSupported,
    apiOrigin: configJson.apiOrigin,
    grpcApiOrigin: configJson.grpcApiOrigin,
    peerManagementEndpoint: fallbackWhenUnset(
      configJson?.peerManagementEndpoint,
      "",
    ),
    audience: configJson.authAudience,
    redirectURI: redirectURI,
    silentRedirectURI: silentRedirectURI,
    tokenSource: tokenSource,
    dragQueryParams: configJson.dragQueryParams == "true", // Drags all the query params to the auth layer specified in the URL when accessing dashboard.
    hotjarTrackID: configJson?.hotjarTrackID || undefined,
    googleAnalyticsID: configJson?.googleAnalyticsID || undefined,
    googleTagManagerID: configJson?.googleTagManagerID || undefined,
    wasmPath: fallbackWhenUnset(
      configJson?.wasmPath,
      "/wasm/anonbird-client.wasm",
    ),
    releaseCheckEnabled: configJson?.releaseCheckEnabled === "true",
    releaseCheckURL:
      configJson?.releaseCheckURL && !configJson.releaseCheckURL.startsWith("$")
        ? configJson.releaseCheckURL
        : undefined,
    anonbirdSourceURL: fallbackWhenUnset(
      configJson?.anonbirdSourceURL,
      "https://github.com/Cr0me1ve/anonbird.git",
    ),
    anonbirdDockerImage: fallbackWhenUnset(
      configJson?.anonbirdDockerImage,
      "anonbird:local",
    ),
  } as Config;
};

/**
 * Build the extras object that will be passed to the auth layer
 */
export const buildExtras = () => {
  const extras: StringMap = {};
  const config = loadConfig();

  if (config.dragQueryParams) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
      extras[key] = value;
    });
  }

  if (config.audience) {
    extras.audience = config.audience;
  }
  return extras;
};

export default loadConfig;
