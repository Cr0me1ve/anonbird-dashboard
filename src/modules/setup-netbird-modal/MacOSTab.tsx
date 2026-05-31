import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/Accordion";
import Button from "@components/Button";
import Code from "@components/Code";
import Separator from "@components/Separator";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import {
  AnonymousTransportCommandOptions,
  GRPC_API_ORIGIN,
} from "@utils/netbird";
import {
  BeerIcon,
  DownloadIcon,
  ExternalLinkIcon,
  PackageOpenIcon,
  TerminalSquareIcon,
} from "lucide-react";
import Link from "next/link";
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
  const keyStep = GRPC_API_ORIGIN ? 3 : 2;
  const runStep = keyStep + (setupKeyContent ? 1 : 0);
  const usingSetupKeyParam = !!setupKey || !!setupKeyPlaceholder;
  return (
    <TabsContent value={String(OperatingSystem.APPLE)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <PackageOpenIcon size={16} />
          Install on macOS
        </p>
        <Steps>
          <Steps.Step step={1}>
            <div className={"flex items-center gap-1 text-sm font-light"}>
              Download and run macOS Installer
            </div>
            <div className={"flex gap-4 mt-1 flex-wrap"}>
              <Link
                href={"https://pkgs.netbird.io/macos/universal"}
                passHref
                target={"_blank"}
              >
                <Button variant={"primary"}>
                  <DownloadIcon size={14} />
                  Download AnonBird
                </Button>
              </Link>
            </div>
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
                  <Code>
                    curl -fsSL https://pkgs.netbird.io/install.sh | sh
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
      <Separator />
      <TabsContentPadding>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <BeerIcon size={16} /> Install manually with HomeBrew
            </AccordionTrigger>
            <AccordionContent>
              <Steps>
                <Steps.Step step={1}>
                  <p>Download and install HomeBrew</p>
                  <div className={"flex gap-4"}>
                    <Link href={"https://brew.sh/"} passHref target={"_blank"}>
                      <Button variant={"primary"}>
                        <ExternalLinkIcon size={14} />
                        HomeBrew Installation Guide
                      </Button>
                    </Link>
                  </div>
                </Steps.Step>
                <Steps.Step step={2}>
                  <p>Install client packages</p>
                  <Code
                    codeToCopy={[
                      `brew install netbirdio/tap/netbird`,
                      `brew install --cask netbirdio/tap/netbird-ui`,
                    ].join("\n")}
                  >
                    <Code.Comment># for CLI only</Code.Comment>
                    <Code.Line>brew install netbirdio/tap/netbird</Code.Line>
                    <Code.Comment># for GUI package</Code.Comment>
                    <Code.Line>
                      brew install --cask netbirdio/tap/netbird-ui
                    </Code.Line>
                  </Code>
                </Steps.Step>
                <Steps.Step step={3}>
                  <p>Start AnonBird daemon</p>
                  <Code>
                    <Code.Line>sudo anonbird service install</Code.Line>
                    <Code.Line>sudo anonbird service start</Code.Line>
                  </Code>
                </Steps.Step>
                <Steps.Step step={4} line={false}>
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
