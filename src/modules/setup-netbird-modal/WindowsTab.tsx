import Code from "@components/Code";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import {
  ANONBIRD_SOURCE_URL,
  AnonymousTransportCommandOptions,
  GRPC_API_ORIGIN,
} from "@utils/netbird";
import { PackageOpenIcon } from "lucide-react";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import {
  AnonBirdUpCommand,
  RoutingPeerSetupKeyInfo,
} from "@/modules/setup-netbird-modal/SetupModal";

type Props = {
  setupKey?: string;
  setupKeyContent?: React.ReactNode;
  setupKeyPlaceholder?: string;
  showSetupKeyInfo?: boolean;
  hostname?: string;
  anonymousTransport?: AnonymousTransportCommandOptions;
};

export default function WindowsTab({
  setupKey,
  setupKeyContent,
  setupKeyPlaceholder,
  showSetupKeyInfo,
  hostname,
  anonymousTransport,
}: Readonly<Props>) {
  // The CLI-run branch is required for the server flow (setupKeyContent
  // present) even before a key is generated — the placeholder keeps the
  // command shape consistent. Otherwise we fall back to the existing
  // setupKey-driven branching.
  const useCliRun = !!setupKey || !!setupKeyContent;
  const baseMgmtStep = 2;
  const keyStep = GRPC_API_ORIGIN ? 3 : 2;
  const runStep = keyStep + (setupKeyContent ? 1 : 0);
  const installCommand = [
    `git clone ${ANONBIRD_SOURCE_URL} anonbird`,
    "cd anonbird",
    "go build -trimpath -o anonbird.exe ./client",
    ".\\anonbird.exe service install",
    ".\\anonbird.exe service start",
  ].join("\n");
  return (
    <TabsContent value={String(OperatingSystem.WINDOWS)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <PackageOpenIcon size={16} />
          Install on Windows
        </p>
        <Steps>
          <Steps.Step step={1}>
            <p>Build and install AnonBird from PowerShell</p>
            <Code codeToCopy={installCommand}>
              <Code.Line>git clone {ANONBIRD_SOURCE_URL} anonbird</Code.Line>
              <Code.Line>cd anonbird</Code.Line>
              <Code.Line>go build -trimpath -o anonbird.exe ./client</Code.Line>
              <Code.Line>{".\\anonbird.exe service install"}</Code.Line>
              <Code.Line>{".\\anonbird.exe service start"}</Code.Line>
            </Code>
          </Steps.Step>

          {GRPC_API_ORIGIN && (
            <Steps.Step step={baseMgmtStep}>
              <p>
                {`Click on "Settings" then "Advanced Settings" from the AnonBird icon in your system tray and enter the following "Management URL"`}
              </p>
              <Code>
                <Code.Line>{GRPC_API_ORIGIN}</Code.Line>
              </Code>
            </Steps.Step>
          )}

          {setupKeyContent && (
            <Steps.Step step={keyStep}>{setupKeyContent}</Steps.Step>
          )}

          {useCliRun ? (
            <Steps.Step step={runStep} line={false}>
              <p>
                Open Command-line and run AnonBird{" "}
                {showSetupKeyInfo && <RoutingPeerSetupKeyInfo />}
              </p>

              <Code>
                <AnonBirdUpCommand
                  setupKey={setupKey}
                  setupKeyPlaceholder={setupKeyPlaceholder}
                  hostname={hostname}
                  anonymousTransport={anonymousTransport}
                />
              </Code>
            </Steps.Step>
          ) : (
            <>
              <Steps.Step step={runStep}>
                <p>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Click on "Connect" from the AnonBird icon in your system tray
                </p>
              </Steps.Step>
              <Steps.Step step={runStep + 1} line={false}>
                <p>Sign up using your email address</p>
              </Steps.Step>
            </>
          )}
        </Steps>
      </TabsContentPadding>
    </TabsContent>
  );
}
