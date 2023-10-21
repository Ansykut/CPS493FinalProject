/* B"H
*/

import data from "../data/users.json";

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

export function getUsers(): User[] {
    const users: User[] = [];
    for (const x of data.users) {
        const role = x.id <= 5 ? 'admin' : 'user'; // every user with id <= 5 is an admin
        users.push({ ...x, role }); // add the role to the user by spreading the user object
        //  example{ id: value, firstName: value, lastName: value, email: value, password: value, role: value }
    }
    return users;
}

export function getUserById(id: number): User | undefined {
    return getUsers().find( x => x.id === id );
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find( x => x.email === email );
}

export function getUsersFriendsIds(userId: number): number[] {
  const allUsers = getUsers();
  const ourUserIdSmaller = userId % 20;
  // get all users whose ids are divisible by 3
  const friends = getUsers().filter( x => x.id !== userId && x.id % ourUserIdSmaller === 0 );
  const friendsIds = friends.map( x => x.id );
  // return max 5 friends
  return friendsIds.slice(0, 5);
}