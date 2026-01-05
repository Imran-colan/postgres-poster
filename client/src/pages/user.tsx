import AddUserButton from "@/components/AddUserButton";
import DeleteUserButton from "@/components/DeleteUserButton";
import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { appEventEmitter } from "@/utils/appEventEmitter";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell, Avatar
} from "@heroui/react";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  created: string;
  avatar: string;
  avatarMime: string;
}
export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users/all");
      const data = await response.json();
      if (data?.users) setUsers(data.users);
    };
    fetchUsers();
    const unsubscribe = appEventEmitter.subscribe("event:users-mutated", () => {
      fetchUsers();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <DefaultLayout>
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className={title()}>User</h1>
          <p className={subtitle()}>User page</p>
        </div>
        <AddUserButton />
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>CREATED</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-row items-center gap-2">
                  <Avatar size="sm" isBordered src={user.avatar} />
                  <p>{user.name}</p>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{new Date(user.created).toDateString()}</TableCell>
              <TableCell>
                <DeleteUserButton id={user.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DefaultLayout>
  );
}
