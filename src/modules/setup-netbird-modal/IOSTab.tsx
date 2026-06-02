import Code from "@components/Code";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import {
  AnonymousTransportCommandOptions,
  getAnonymousManagementOrigin,
} from "@utils/netbird";
import { ShoppingBagIcon } from "lucide-react";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";

type Props = {
  anonymousTransport?: AnonymousTransportCommandOptions;
};

export default function IOSTab({ anonymousTransport }: Readonly<Props>) {
  const managementOrigin = getAnonymousManagementOrigin(anonymousTransport);
  return (
    <TabsContent value={String(OperatingSystem.IOS)}>
      <TabsContentPadding>
        <p className={"font-medium flex gap-3 items-center text-base"}>
          <ShoppingBagIcon size={16} />
          Install on iOS
        </p>
        <Steps>
          <Steps.Step step={1}>
            <p>AnonBird iOS packages are not published by this fork yet.</p>
          </Steps.Step>
          {managementOrigin && (
            <Steps.Step step={2}>
              <p>
                {`Click on "Change Server" and enter the following "Server"`}
              </p>
              <Code>
                <Code.Line>{managementOrigin}</Code.Line>
              </Code>
            </Steps.Step>
          )}

          <Steps.Step step={managementOrigin ? 3 : 2}>
            <p>Use the Linux, macOS, Windows, or Docker source-build tabs.</p>
          </Steps.Step>
        </Steps>
      </TabsContentPadding>
    </TabsContent>
  );
}
