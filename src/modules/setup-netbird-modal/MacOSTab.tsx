import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/Accordion";
import Code from "@components/Code";
import Separator from "@components/Separator";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import {
  ANONYMOUS_MANAGEMENT_ORIGIN,
  ANONBIRD_SOURCE_URL,
  AnonymousTransportCommandOptions,
} from "@utils/netbird";
import { PackageOpenIcon, TerminalSquareIcon } from "lucide-react";
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
export default function MacOSTab({
  setupKey,
  setupKeyContent,
  setupKeyPlaceholder,
  showSetupKeyInfo,
  hostname,
  anonymousTransport,
}: Readonly<Props>) {
  // Mirrors WindowsTab: server flow (setupKeyContent present) forces
  // the CLI run branch so the anonbird up command stays visible while
  // the operator generates a key.
  const useCliRun = !!setupKey || !!setupKeyContent;
  const baseMgmtStep = 2;
  const keyStep = ANONYMOUS_MANAGEMENT_ORIGIN ? 3 : 2;
  const runStep = keyStep + (setupKeyContent ? 1 : 0);
  const usingSetupKeyParam = !!setupKey || !!setupKeyPlaceholder;
  const installCommand = [
    "brew install go git",
    `git clone ${ANONBIRD_SOURCE_URL} anonbird`,
    "cd anonbird",
    "go build -trimpath -o anonbird ./client",
    "sudo install -m 0755 anonbird /usr/local/bin/anonbird",
    "sudo anonbird service install",
    "sudo anonbird service start",
  ].join("\n");
  return (
    <TabsContent value={String(OperatingSystem.APPLE)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <PackageOpenIcon size={16} />
          Install on macOS
        </p>
        <Steps>
          <Steps.Step step={1}>
            <p>Build and install AnonBird from source</p>
            <Code codeToCopy={installCommand}>
              <Code.Line>brew install go git</Code.Line>
              <Code.Line>git clone {ANONBIRD_SOURCE_URL} anonbird</Code.Line>
              <Code.Line>cd anonbird</Code.Line>
              <Code.Line>go build -trimpath -o anonbird ./client</Code.Line>
              <Code.Line>
                sudo install -m 0755 anonbird /usr/local/bin/anonbird
              </Code.Line>
              <Code.Line>sudo anonbird service install</Code.Line>
              <Code.Line>sudo anonbird service start</Code.Line>
            </Code>
          </Steps.Step>

          {ANONYMOUS_MANAGEMENT_ORIGIN && (
            <Steps.Step step={baseMgmtStep}>
              <p>
                {`Click on "Settings" then "Advanced Settings" from the AnonBird icon in your system tray and enter the following "Management URL"`}
              </p>
              <Code>
                <Code.Line>{ANONYMOUS_MANAGEMENT_ORIGIN}</Code.Line>
              </Code>
            </Steps.Step>
          )}

          {setupKeyContent && (
            <Steps.Step step={keyStep}>{setupKeyContent}</Steps.Step>
          )}

          {useCliRun ? (
            <Steps.Step step={runStep} line={false}>
              <p>
                Open Terminal and run AnonBird{" "}
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
      <Separator />
      <TabsContentPadding>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <TerminalSquareIcon size={16} />
              Install manually with Terminal
            </AccordionTrigger>
            <AccordionContent>
              <Steps>
                <Steps.Step step={1}>
                  <Code codeToCopy={installCommand}>
                    <Code.Line>brew install go git</Code.Line>
                    <Code.Line>
                      git clone {ANONBIRD_SOURCE_URL} anonbird
                    </Code.Line>
                    <Code.Line>cd anonbird</Code.Line>
                    <Code.Line>
                      go build -trimpath -o anonbird ./client
                    </Code.Line>
                    <Code.Line>
                      sudo install -m 0755 anonbird /usr/local/bin/anonbird
                    </Code.Line>
                    <Code.Line>sudo anonbird service install</Code.Line>
                    <Code.Line>sudo anonbird service start</Code.Line>
                  </Code>
                </Steps.Step>
                <Steps.Step step={2} line={false}>
                  <p>
                    Run AnonBird{" "}
                    {!usingSetupKeyParam && "and log in the browser"}
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
              </Steps>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContentPadding>
    </TabsContent>
  );
}
