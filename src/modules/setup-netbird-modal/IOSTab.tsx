import Code from "@components/Code";
import Steps from "@components/Steps";
import TabsContentPadding, { TabsContent } from "@components/Tabs";
import { ANONYMOUS_MANAGEMENT_ORIGIN } from "@utils/netbird";
import { ShoppingBagIcon } from "lucide-react";
import React from "react";
import { OperatingSystem } from "@/interfaces/OperatingSystem";

export default function IOSTab() {
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
          {ANONYMOUS_MANAGEMENT_ORIGIN && (
            <Steps.Step step={2}>
              <p>
                {`Click on "Change Server" and enter the following "Server"`}
              </p>
              <Code>
                <Code.Line>{ANONYMOUS_MANAGEMENT_ORIGIN}</Code.Line>
              </Code>
            </Steps.Step>
          )}

          <Steps.Step step={ANONYMOUS_MANAGEMENT_ORIGIN ? 3 : 2}>
            <p>Use the Linux, macOS, Windows, or Docker source-build tabs.</p>
          </Steps.Step>
        </Steps>
      </TabsContentPadding>
    </TabsContent>
  );
}
