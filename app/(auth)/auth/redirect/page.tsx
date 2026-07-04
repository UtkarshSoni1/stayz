import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * /auth/redirect — single role-based redirect hub.
 *
 * Both Google OAuth and Credentials login funnel through here after a
 * successful sign-in so that the dashboard decision lives in one place.
 *
 * The proxy lets /auth/* through (no role check), so this page is always
 * reachable immediately after Auth.js sets the session cookie.
 */
export default async function AuthRedirectPage() {
  const session = await auth();

  if (!session?.user?.id) {
    // Not authenticated — should not normally reach here, but guard anyway
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "ADMIN") redirect("/admin/dashboard");
  if (role === "OWNER") redirect("/owner/dashboard");
  redirect("/user/dashboard");
}
