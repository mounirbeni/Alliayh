import { redirect } from "next/navigation";
export default function LoginRedirect() {
  redirect("/pt-PT/auth/login");
}
