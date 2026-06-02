import Breadcrumbs from "@components/Breadcrumbs";
import Button from "@components/Button";
import { Callout } from "@components/Callout";
import HelpText from "@components/HelpText";
import { Input } from "@components/Input";
import { Label } from "@components/Label";
import { notify } from "@components/Notification";
import { SegmentedTabs } from "@components/SegmentedTabs";
import { useHasChanges } from "@hooks/useHasChanges";
import * as Tabs from "@radix-ui/react-tabs";
import { useApiCall } from "@utils/api";
import {
  generateRandomI2PManagementURL,
  generateRandomOnionManagementURL,
  isAnonymousManagementURL,
} from "@utils/netbird";
import {
  AlertTriangleIcon,
  DicesIcon,
  RadioTowerIcon,
  RouterIcon,
  ShieldCheckIcon,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { Account } from "@/interfaces/Account";

type Props = {
  account: Account;
};

type EndpointTransport = "tor" | "i2p";

const endpointTransport = (endpoint: string): EndpointTransport =>
  endpoint.includes(".i2p") ? "i2p" : "tor";

const generateEndpoint = (transport: EndpointTransport) =>
  transport === "i2p"
    ? generateRandomI2PManagementURL()
    : generateRandomOnionManagementURL();

export default function AnonymousNetworkSettingsTab({
  account,
}: Readonly<Props>) {
  const { permission } = usePermissions();
  const { mutate } = useSWRConfig();
  const saveRequest = useApiCall<Account>("/accounts/" + account.id, true);

  const storedEndpoint =
    account.settings?.extra?.peer_management_endpoint?.trim() ?? "";
  const [lastSavedEndpoint, setLastSavedEndpoint] = useState(storedEndpoint);
  const [transport, setTransport] = useState<EndpointTransport>(
    endpointTransport(storedEndpoint),
  );
  const [peerManagementEndpoint, setPeerManagementEndpoint] = useState(
    () => storedEndpoint || generateRandomOnionManagementURL(),
  );

  const trimmedEndpoint = peerManagementEndpoint.trim();
  const { hasChanges, updateRef } = useHasChanges([trimmedEndpoint]);
  const generatedDefaultPending = !lastSavedEndpoint && !!trimmedEndpoint;
  const changingExistingEndpoint =
    !!lastSavedEndpoint && lastSavedEndpoint !== trimmedEndpoint;

  const endpointError = useMemo(() => {
    if (!trimmedEndpoint) return "Peer management endpoint cannot be empty.";
    if (!isAnonymousManagementURL(trimmedEndpoint)) {
      return "Use an http(s) .onion or .i2p URL.";
    }
    return "";
  }, [trimmedEndpoint]);

  const selectTransport = (value: EndpointTransport) => {
    setTransport(value);
    setPeerManagementEndpoint(generateEndpoint(value));
  };

  const generateRandomEndpoint = () => {
    setPeerManagementEndpoint(generateEndpoint(transport));
  };

  const saveChanges = async () => {
    if (changingExistingEndpoint) {
      const confirmed = window.confirm(
        "Changing the peer management endpoint changes future install commands. Existing peers that were configured with the old URL may fail to reconnect if that Tor/I2P service is removed. Save anyway?",
      );
      if (!confirmed) return;
    }

    const currentExtra = account.settings.extra ?? {
      peer_approval_enabled: false,
      user_approval_required: false,
    };

    notify({
      title: "Anonymous Network",
      description: "Peer management endpoint saved.",
      promise: saveRequest
        .put({
          id: account.id,
          settings: {
            ...account.settings,
            extra: {
              ...currentExtra,
              peer_management_endpoint: trimmedEndpoint,
            },
          },
        })
        .then(() => {
          mutate("/accounts");
          setLastSavedEndpoint(trimmedEndpoint);
          updateRef([trimmedEndpoint]);
        }),
      loadingMessage: "Saving anonymous network settings...",
    });
  };

  const saveDisabled =
    (!hasChanges && !generatedDefaultPending) ||
    !permission.settings.update ||
    !!endpointError;

  return (
    <Tabs.Content value={"anonymous-network"}>
      <div className={"p-default py-6 max-w-2xl"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/settings"}
            label={"Settings"}
            icon={<SettingsIcon size={13} />}
          />
          <Breadcrumbs.Item
            href={"/settings?tab=anonymous-network"}
            label={"Anonymous Network"}
            icon={<ShieldCheckIcon size={14} />}
            active
          />
        </Breadcrumbs>
        <div className={"flex items-start justify-between"}>
          <div>
            <h1>Anonymous Network</h1>
          </div>
          <Button
            variant={"primary"}
            disabled={saveDisabled}
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>

        <div className={"flex flex-col gap-6 w-full mt-8"}>
          <div className={"flex flex-col gap-3"}>
            <Label>
              <ShieldCheckIcon size={15} />
              Peer Management Endpoint
            </Label>
            <HelpText>
              Dashboard access can stay on clearnet. Peer install commands use
              this Tor or I2P URL to reach the management server.
            </HelpText>

            <SegmentedTabs
              value={transport}
              onChange={(value) => selectTransport(value as EndpointTransport)}
            >
              <SegmentedTabs.List className={"rounded-lg border w-fit"}>
                <SegmentedTabs.Trigger value={"tor"}>
                  <RadioTowerIcon size={16} />
                  Tor
                </SegmentedTabs.Trigger>
                <SegmentedTabs.Trigger value={"i2p"}>
                  <RouterIcon size={16} />
                  I2P
                </SegmentedTabs.Trigger>
              </SegmentedTabs.List>
            </SegmentedTabs>

            <div className={"grid gap-3 sm:grid-cols-[1fr_auto]"}>
              <Input
                value={peerManagementEndpoint}
                onChange={(event) => {
                  const value = event.target.value;
                  setPeerManagementEndpoint(value);
                  setTransport(endpointTransport(value));
                }}
                error={endpointError}
                placeholder={
                  transport === "i2p"
                    ? "http://management.b32.i2p"
                    : "http://managementxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.onion"
                }
              />
              <Button
                variant={"secondary"}
                onClick={generateRandomEndpoint}
                disabled={!permission.settings.update}
              >
                <DicesIcon size={15} />
                Generate
              </Button>
            </div>
          </div>

          {generatedDefaultPending && (
            <Callout variant={"info"}>
              A random endpoint is ready as the default. Save it only when a
              matching Tor or I2P service is configured for this management
              server.
            </Callout>
          )}

          {changingExistingEndpoint && (
            <Callout
              variant={"warning"}
              icon={
                <AlertTriangleIcon
                  size={15}
                  className={"shrink-0 relative top-[3px]"}
                />
              }
            >
              Changing this endpoint changes future install commands. Existing
              peers that were configured with the old URL may need to be
              reconfigured or rejoined if the old Tor/I2P service is removed.
            </Callout>
          )}

          <Callout variant={"info"}>
            The one-command installer creates and saves a managed Tor/I2P
            endpoint automatically. Use this page for advanced endpoint changes
            or when migrating to another anonymous service.
          </Callout>
        </div>
      </div>
    </Tabs.Content>
  );
}
