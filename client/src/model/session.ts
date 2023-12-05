/* B"H
*/
import { reactive } from "vue";
import { useRouter } from "vue-router"
import { useToast } from "vue-toastification";
import * as myFetch from "./myFetch";
import { type User, getUserByEmail } from "./users";

const toast = useToast();

const session = reactive({
  user: null as User | null,
  redirectUrl: null as string | null,
  messages: [] as {
    type: string,
    text: string
  }[],
  loading: 0
})

export function api(action: string, body?: unknown, method?: string){
  session.loading++;
  return myFetch.api(`${action}`, body, method)
    .catch(err=> showError(err))
    .finally(()=> session.loading--);
}

export function getSession(){
  return session;
}

export function showError(err: any){
  console.error(err);
  session.messages.push({ type: "error", text: err.message ?? err});
  toast.error( err.message ?? err);
}
export async function loginWithServer(email: string, password: string): Promise<User> {
      
  const router = useRouter();
  const person = await api('users/login', {email, password}, 'POST');

  session.user = person.data.user;

  if(session.user) {
  session.user.token = person.data.token;
  //router.push('/');
  }


  //  router.push(session.redirectUrl ?? "/");
  // session.redirectUrl = null;

  return person.data.user;
}

export function useSession() {
  return session;
}

export function loginWithUser(user: User) {
  session.user = user;
}

export function useLogin(){
  const router = useRouter();

  return {
    async login(email: string, password: string): Promise< User | null> {
      console.log("login", email, password);
     session.user = await api("users/login", { email, password });
     router.push(session.redirectUrl || "/");
      return null
    },
    logout(){
      session.user = null;
      router.push("/login");
    }
  }
}