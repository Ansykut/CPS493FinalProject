/* B"H
*/
import { reactive } from "vue";
import { useRouter } from "vue-router"
import { useToast } from "vue-toastification";
import * as myFetch from "./myFetch";
import type { DataEnvelope, DataListEnvelope } from "./myFetch";
import type { Workout } from "./workouts";
import { type User, getUserByEmail } from "./users";

const toast = useToast();

const session = reactive({
  user: null as User | null,
  isLoading: false,
  messages: [] as {
      msg: string,
      type: "success" | "danger" | "warning" | "info",
  }[],
  redirectUrl: null as string | null,
})
export function createUser(user: User): Promise<DataEnvelope<User>> {

  return api('/users/', user, 'POST')
}
export function api(url: string, data?: any, method?: string, headers?: any) {
  session.isLoading = true;

  if(session.user?.token)
  {headers = {
      "Authorization": `Bearer ${session.user?.token}`,
      ...headers,
  }
}
  return myFetch.api(url, data, method, headers)
  .catch(err=> showError(err))
      .finally(() => {
          session.isLoading = false;
      })
}


export function getSession(){
  return session;
}

export function showError(err: any) {
  debugger;
  console.error(err);
  session.messages.push({
    msg: err.message ?? err,
    type: "danger",
  });
  toast.error( err.message ?? err);
}

export async function loginWithServer(email: string, password: string): Promise<User | null> {
  try {
    const response = await api('/users/login', {email, password}, 'POST');
    session.user = response.data.user;

    if(session.user) {
      session.user.token = response.data.token;
      // Handle successful login, e.g., show a success toast, redirect, etc.
      return session.user;
    } else {
      // Handle case where login is unsuccessful but no error is thrown
      toast.error("Login unsuccessful");
      return null;
    }
  } catch (err) {
    // Handle any errors that occur during the login process
    showError(err);
    return null;
  }
}

export async function logout() {
  session.user = null;
  // handle other logout related tasks like clearing tokens, redirecting, etc.
}

export function useLogin(email: string, password: string) {
    

  return async function() {
   const response = await api('/users/login', {email, password}, 'POST');

   session.user = response.data.user;
   
   console.log(session.user);
   if(!session.user) {
       //addMessage("User not found", "danger");
       return;
   }
   session.user.token = response.data.token;



     return response.data.user;
  

  //  router.push(session.redirectUrl ?? "/");
  //  session.redirectUrl = null;
}
}
export function useSession() {
  return session;
}
export function loginWithUser(user: User) {
  session.user = user;
}