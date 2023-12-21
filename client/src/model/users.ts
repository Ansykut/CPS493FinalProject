/* B"H
*/

import data from "../data/users.json";
import { reactive } from "vue";
import { api } from "./session";
import type { DataEnvelope, DataListEnvelope } from "./myFetch";

export interface User {
  _id: number,
  firstName: string,
  lastName: string,
  email: string,
  password?: string,
  role: "admin" | "user",
  token?: string,
  image: string
}

export function getUsers(): Promise<DataListEnvelope<User>> {
  return api('users');
}

export function getEmail(): Promise<DataEnvelope<string>> {
  return api('users/email');
}
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  const user = users.data.find((x: User) => x.email === email);
  return user;
}

