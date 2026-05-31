import loadConfig from "@utils/config";

const config = loadConfig();
export const GRPC_API_ORIGIN = config.grpcApiOrigin;

export type AnonymousTransportType = "tor-relay-only" | "i2p-datagram";
export type I2PDaemonMode = "external" | "auto" | "managed";

export type AnonymousTransportCommandOptions = {
  transport?: AnonymousTransportType;
  torSOCKS5?: string;
  i2pSAM?: string;
  i2pTunnelLength?: string | number;
  i2pTunnelQuantity?: string | number;
  i2pDaemonMode?: I2PDaemonMode;
  i2pdPath?: string;
  i2pDataDir?: string;
};

export const DEFAULT_TOR_SOCKS5 = "127.0.0.1:9050";
export const DEFAULT_I2P_SAM = "127.0.0.1:7656";
export const DEFAULT_I2P_TUNNEL_LENGTH = 1;
export const DEFAULT_I2P_TUNNEL_QUANTITY = 3;
export const DEFAULT_I2P_DAEMON_MODE: I2PDaemonMode = "auto";
export const DEFAULT_I2PD_PATH = "i2pd";

export const getAnonBirdJoinURL = (
  setupKey: string,
  options?: AnonymousTransportCommandOptions,
  hostname?: string,
) => {
  if (!setupKey || !GRPC_API_ORIGIN) return undefined;

  const transport = options?.transport ?? "tor-relay-only";
  const params = new URLSearchParams({
    server: GRPC_API_ORIGIN,
    setup_key: setupKey,
    transport,
  });

  if (hostname) {
    params.set("hostname", hostname);
  }

  if (transport == "tor-relay-only") {
    if (options?.torSOCKS5) {
      params.set("tor_socks5", options.torSOCKS5);
    }
  } else {
    params.set("i2p_sam", options?.i2pSAM || DEFAULT_I2P_SAM);
    params.set(
      "i2p_tunnel_length",
      String(options?.i2pTunnelLength || DEFAULT_I2P_TUNNEL_LENGTH),
    );
    params.set(
      "i2p_tunnel_quantity",
      String(options?.i2pTunnelQuantity || DEFAULT_I2P_TUNNEL_QUANTITY),
    );
    params.set(
      "i2p_daemon_mode",
      options?.i2pDaemonMode || DEFAULT_I2P_DAEMON_MODE,
    );
    params.set("i2pd_path", options?.i2pdPath || DEFAULT_I2PD_PATH);
    if (options?.i2pDataDir) {
      params.set("i2p_data_dir", options.i2pDataDir);
    }
  }

  return `anonbird://join?${params.toString()}`;
};

export const getAnonBirdJoinCommand = (
  setupKey: string,
  options?: AnonymousTransportCommandOptions,
  hostname?: string,
) => {
  const joinURL = getAnonBirdJoinURL(setupKey, options, hostname);
  return joinURL ? `anonbird join "${joinURL}"` : undefined;
};

export const getAnonBirdUpCommand = (
  options?: AnonymousTransportCommandOptions,
) => {
  const transport = options?.transport ?? "tor-relay-only";
  let cmd = `anonbird up --anonymous-mode --anonymous-transport ${transport}`;

  if (transport == "tor-relay-only" && options?.torSOCKS5) {
    cmd += " --tor-socks5 " + options.torSOCKS5;
  }

  if (transport == "i2p-datagram") {
    cmd +=
      " --i2p-sam " +
      (options?.i2pSAM || DEFAULT_I2P_SAM) +
      " --i2p-tunnel-length " +
      (options?.i2pTunnelLength || DEFAULT_I2P_TUNNEL_LENGTH) +
      " --i2p-tunnel-quantity " +
      (options?.i2pTunnelQuantity || DEFAULT_I2P_TUNNEL_QUANTITY) +
      " --i2p-daemon-mode " +
      (options?.i2pDaemonMode || DEFAULT_I2P_DAEMON_MODE) +
      " --i2pd-path " +
      (options?.i2pdPath || DEFAULT_I2PD_PATH);
    if (options?.i2pDataDir) {
      cmd += " --i2p-data-dir " + options.i2pDataDir;
    }
  }

  if (GRPC_API_ORIGIN) {
    cmd += " --management-url " + GRPC_API_ORIGIN;
  }
  return cmd;
};

export const getAnonymousTransportDockerEnv = (
  options?: AnonymousTransportCommandOptions,
) => {
  const transport = options?.transport ?? "tor-relay-only";
  const env = [
    ["NB_ANONYMOUS_MODE", "true"],
    ["NB_ANONYMOUS_TRANSPORT", transport],
  ];

  if (transport == "tor-relay-only") {
    env.push(["NB_TOR_SOCKS5", options?.torSOCKS5 || DEFAULT_TOR_SOCKS5]);
  } else {
    env.push(["NB_I2P_SAM", options?.i2pSAM || DEFAULT_I2P_SAM]);
    env.push([
      "NB_I2P_TUNNEL_LENGTH",
      String(options?.i2pTunnelLength || DEFAULT_I2P_TUNNEL_LENGTH),
    ]);
    env.push([
      "NB_I2P_TUNNEL_QUANTITY",
      String(options?.i2pTunnelQuantity || DEFAULT_I2P_TUNNEL_QUANTITY),
    ]);
    env.push([
      "NB_I2P_DAEMON_MODE",
      options?.i2pDaemonMode || DEFAULT_I2P_DAEMON_MODE,
    ]);
    env.push(["NB_I2PD_PATH", options?.i2pdPath || DEFAULT_I2PD_PATH]);
    if (options?.i2pDataDir) {
      env.push(["NB_I2P_DATA_DIR", options.i2pDataDir]);
    }
  }

  return env.map(([key, value]) => ({ key, value }));
};

export const getInstallUrl = () => {
  return window.location.origin + "/install";
};

export const isNetBirdHosted = () => {
  const hostname = window.location.hostname;
  if (hostname.includes("selfhosted")) return false;
  return (
    hostname.endsWith(".netbird.io") || hostname.endsWith(".wiretrustee.com")
  );
};

export const isLocalDev = () => {
  return window.location.hostname.includes("localhost");
};

export const isProduction = () => {
  return process.env.NODE_ENV === "production";
};
