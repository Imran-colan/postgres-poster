import { appEventEmitter } from "@/utils/appEventEmitter";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { notifyAsync } from "./notifyAsync";
import { DeleteIcon } from "@/assets/icons";
const deleteUser = async (id: number) => {
  const createUserPromise = () =>
    fetch("/api/users/delete/" + id, {
      method: "DELETE",
    }).then(async (res) => {
      if (!res.ok) throw new Error("Failed to delete user");
      appEventEmitter.emit("event:users-mutated", {});
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(res.json());
        }, 3000);
      });
    });

  try {
    await notifyAsync(createUserPromise, {
      loadingTitle: "Deleting user…",
      successTitle: "User deleted",
      successDescription: "User deleted successfully 🎉",
      onSuccess: () => appEventEmitter.emit("event:users-mutated", {}),
      errorTitle: "User deletion failed",
      errorDescription: (err) =>
        err instanceof Error ? err.message : "Unknown error",
    });
  } catch {}
};
export default function DeleteUserButton({ id }: { id: number }) {
  const { isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        aria-label="Delete"
        color="danger"
        variant="flat"
        size="sm"
        onPress={() => onOpenChange()}
      >
        <DeleteIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete user
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => deleteUser(id)}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
