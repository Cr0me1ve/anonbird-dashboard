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
  ANONBIRD_SOURCE_URL,
  AnonymousTransportCommandOptions,
} from "@utils/netbird";
import { IconBrandUbuntu } from "@tabler/icons-react";
import { TerminalSquareIcon } from "lucide-react";
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

export default function LinuxTab({
  setupKey,
  setupKeyContent,
  setupKeyPlaceholder,
  showSetupKeyInfo = false,
  hostname,
  anonymousTransport,
}: Readonly<Props>) {
  const runStep = setupKeyContent ? 3 : 2;
  const usingSetupKey = !!setupKey || !!setupKeyPlaceholder;
  const installCommand = [
    "sudo apt-get update",
    "sudo apt-get install -y git curl ca-certificates build-essential",
    `git clone ${ANONBIRD_SOURCE_URL} anonbird`,
    "cd anonbird",
    "go build -trimpath -o anonbird ./client",
    "sudo install -m 0755 anonbird /usr/local/bin/anonbird",
    "sudo anonbird service install",
    "sudo anonbird service start",
  ].join("\n");
  return (
    <TabsContent value={String(OperatingSystem.LINUX)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <TerminalSquareIcon size={16} />
          Install with Command-line
        </p>
        <Steps>
          <Steps.Step step={1}>
            <Code codeToCopy={installCommand}>
              <Code.Line>sudo apt-get update</Code.Line>
              <Code.Line>
                sudo apt-get install -y git curl ca-certificates
                build-essential
              </Code.Line>
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
          {setupKeyContent && (
            <Steps.Step step={2}>{setupKeyContent}</Steps.Step>
          )}
          <Steps.Step step={runStep} line={false}>
            <p>
              Run AnonBird {!usingSetupKey && "and log in the browser"}
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
      </TabsContentPadding>
      <Separator />
      <TabsContentPadding>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <IconBrandUbuntu size={16} />
              Install manually on Ubuntu
            </AccordionTrigger>
            <AccordionContent>
              <Steps>
                <Steps.Step step={1}>
                  <p>Build and install AnonBird from source</p>
                  <Code codeToCopy={installCommand}>
                    <Code.Line>sudo apt-get update</Code.Line>
                    <Code.Line>
                      sudo apt-get install -y git curl ca-certificates
                      build-essential
                    </Code.Line>
                    <Code.Line>git clone {ANONBIRD_SOURCE_URL} anonbird</Code.Line>
                    <Code.Line>cd anonbird</Code.Line>
                    <Code.Line>go build -trimpath -o anonbird ./client</Code.Line>
                    <Code.Line>
                      sudo install -m 0755 anonbird /usr/local/bin/anonbird
                    </Code.Line>
                  </Code>
                </Steps.Step>
                <Steps.Step step={2}>
                  <p>Install and start the service</p>
                  <Code>
                    <Code.Line>sudo anonbird service install</Code.Line>
                    <Code.Line>sudo anonbird service start</Code.Line>
                  </Code>
                </Steps.Step>
                <Steps.Step step={3} line={false}>
                  <p>
                    Run AnonBird {!usingSetupKey && "and log in the browser"}
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
