import { notifyAsync } from "@/components/notifyAsync";
import { appEventEmitter } from "@/utils/appEventEmitter";
import { Form, Input } from "@heroui/react";
import { useState } from "react";
const randomInt = Math.floor(Math.random() * (100 - 0 + 1));

export default function AddUserForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("ray" + randomInt);
  const [email, setEmail] = useState("ray" + randomInt + "@gmail.com");
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("avatarMime", avatar?.type || "image/jpeg");
    if (avatar) formData.append("avatar", avatar);
    const createUserPromise = () =>
      fetch("/api/users/add", {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        if (!res.ok) throw new Error("Failed to add user");
        appEventEmitter.emit("event:users-mutated", {});
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(res.json());
          }, 3000);
        });
      });

    try {
      await notifyAsync(createUserPromise, {
        loadingTitle: "Adding user…",
        successTitle: "User created",
        successDescription: "User added successfully 🎉",
        errorTitle: "User creation failed",
        errorDescription: (err) =>
          err instanceof Error ? err.message : "Unknown error",
      });
    } catch {
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} id="add-user-form">
        <Input label="Name" type="text" value={name} onValueChange={setName} />
        <Input
          label="Email"
          type="email"
          value={email}
          onValueChange={setEmail}
        />
        <Input
          label="Avatar"
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
        />
      </Form>
    </>
  );
}
