/* B"H
*/

import data from "../data/users.json";
import { reactive } from "vue";
import { api } from "./session";

export interface User {
  id: number,
  
  firstName: string,
  lastName: string,
  email: string,
  password?: string,
  role: "admin" | "user",
  token?: string,
  image: string,
}

// reactive Users array
export const Users = reactive<User[]>(sanitizeUsersData());

function sanitizeUsersData() {
  const users: User[] = [];
  for (const x of data.users) {
    const role = x.id <= 5 ? 'admin' : 'user'; // every user with id <= 5 is an admin
    users.push({ ...x, role }); // add the role to the user by spreading the user object
    //  example{ id: value, firstName: value, lastName: value, email: value, password: value, role: value }
  }
  return users
}

export function deleteUserById(id: number): void {
  console.log('deleteUserById', id, Users)
  const index = Users.findIndex(x => x.id === id);
  Users.splice(index, 1);
}

export function getUserById(id: number): User | undefined {
  return Users.find(x => x.id === id);
}

export function getUsers(): Promise< User[]> {
  return api("users"); 
}
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find( x => x.email === email );
}
export function getUsersFriendsIds(userId: number): number[] {
  const allUsers = Users;
  const ourUserIdSmaller = userId % 20;
  // get all users whose ids are divisible by 3
  const friends = Users.filter(x => x.id !== userId && x.id % ourUserIdSmaller === 0);
  const friendsIds = friends.map(x => x.id);
  // return max 5 friends
  return friendsIds.slice(0, 5);
}