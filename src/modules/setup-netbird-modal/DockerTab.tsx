import Button from "@components/Button";
import Code from "@components/Code";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import { IconBrandUbuntu } from "@tabler/icons-react";
import {
  ANONBIRD_DOCKER_IMAGE,
  ANONBIRD_SOURCE_URL,
  AnonymousTransportCommandOptions,
  getAnonymousTransportDockerEnv,
} from "@utils/netbird";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";
import { RoutingPeerSetupKeyInfo } from "@/modules/setup-netbird-modal/SetupModal";

type Props = {
  setupKey?: string;
  setupKeyContent?: React.ReactNode;
  setupKeyPlaceholder?: string;
  showSetupKeyInfo?: boolean;
  hostname?: string;
  anonymousTransport?: AnonymousTransportCommandOptions;
};

export default function DockerTab({
  setupKey,
  setupKeyContent,
  setupKeyPlaceholder,
  showSetupKeyInfo = false,
  hostname,
  anonymousTransport,
}: Readonly<Props>) {
  const offset = setupKeyContent ? 1 : 0;
  const anonymousEnv = getAnonymousTransportDockerEnv(anonymousTransport);
  const buildCommand = [
    `git clone ${ANONBIRD_SOURCE_URL} anonbird`,
    "cd anonbird",
    "CGO_ENABLED=0 go build -trimpath -o anonbird ./client",
    `docker build -t ${ANONBIRD_DOCKER_IMAGE} -f client/Dockerfile --build-arg ANONBIRD_BINARY=anonbird .`,
  ].join("\n");
  return (
    <TabsContent value={String(OperatingSystem.DOCKER)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <IconBrandUbuntu size={16} />
          Install on Ubuntu
        </p>
        <Steps>
          <Steps.Step step={1}>
            <p>Install Docker</p>
            <div className={"flex gap-4 mt-1"}>
              <Link
                href={"https://docs.docker.com/engine/install/"}
                passHref
                target={"_blank"}
              >
                <Button variant={"primary"}>
                  <ExternalLinkIcon size={14} />
                  Official Docker Installation Guide
                </Button>
              </Link>
            </div>
          </Steps.Step>
          {setupKeyContent && (
            <Steps.Step step={2}>{setupKeyContent}</Steps.Step>
          )}
          <Steps.Step step={2 + offset}>
            <p>Build AnonBird client image</p>
            <Code codeToCopy={buildCommand}>
              <Code.Line>git clone {ANONBIRD_SOURCE_URL} anonbird</Code.Line>
              <Code.Line>cd anonbird</Code.Line>
              <Code.Line>
                CGO_ENABLED=0 go build -trimpath -o anonbird ./client
              </Code.Line>
              <Code.Line>
                docker build -t {ANONBIRD_DOCKER_IMAGE} -f client/Dockerfile
                --build-arg ANONBIRD_BINARY=anonbird .
              </Code.Line>
            </Code>
          </Steps.Step>
          <Steps.Step step={3 + offset} line={false}>
            <p>
              Run AnonBird container
              {showSetupKeyInfo && <RoutingPeerSetupKeyInfo />}
            </p>
            <Code>
              <Code.Line>docker run --rm -d \</Code.Line>
              <Code.Line> --cap-add=NET_ADMIN \</Code.Line>
              <Code.Line>
                {" "}
                -e NB_SETUP_KEY=
                <span className={"text-netbird"}>
                  {setupKey ?? setupKeyPlaceholder ?? "SETUP_KEY"}
                </span>{" "}
                \
              </Code.Line>

              {hostname && (
                <Code.Line>
                  {" "}
                  -e NB_HOSTNAME=
                  <span className={"text-netbird"}>{`'${hostname}'`}</span> \
                </Code.Line>
              )}

              {anonymousEnv.map(({ key, value }) => (
                <Code.Line key={key}>
                  {" "}
                  -e {key}=<span className={"text-netbird"}>{value}</span> \
                </Code.Line>
              ))}

              <Code.Line> -v anonbird-client:/var/lib/anonbird \</Code.Line>
              <Code.Line> {ANONBIRD_DOCKER_IMAGE}</Code.Line>
            </Code>
          </Steps.Step>
        </Steps>
      </TabsContentPadding>
    </TabsContent>
  );
}
