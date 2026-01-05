import AddUserForm from "@/sections/AddUserForm";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function AddUserButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Add User</Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>Add User</DrawerHeader>

              <DrawerBody>
                <AddUserForm onClose={onClose} />
              </DrawerBody>

              <DrawerFooter>
                <Button variant="flat" onPress={onClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary" form="add-user-form">
                  Add User
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
