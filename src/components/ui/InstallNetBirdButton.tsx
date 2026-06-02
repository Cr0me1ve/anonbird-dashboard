import Button from "@components/Button";
import { Modal, ModalTrigger } from "@components/modal/Modal";
import { DownloadIcon } from "lucide-react";
import React, { useState } from "react";
import { useAccount } from "@/modules/account/useAccount";
import SetupModal from "@/modules/setup-netbird-modal/SetupModal";

export function InstallNetBirdButton() {
  const [installModal, setInstallModal] = useState(false);
  const account = useAccount();
  const peerManagementEndpoint =
    account?.settings?.extra?.peer_management_endpoint;

  return (
    <Modal open={installModal} onOpenChange={setInstallModal}>
      <ModalTrigger asChild>
        <Button variant={"secondary"} size={"sm"}>
          <DownloadIcon size={16} />
          Install AnonBird
        </Button>
      </ModalTrigger>
      <SetupModal peerManagementEndpoint={peerManagementEndpoint} />
    </Modal>
  );
}
