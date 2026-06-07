import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/admin-auth";

const errorMessages = {
  google_denied: "Google sign-in was cancelled. Try again when you are ready.",
  invalid_state: "The sign-in session expired. Please start again.",
  missing_google_config:
    "Google OAuth is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
  missing_admin_emails:
    "No admin emails are configured. Add ADMIN_EMAILS to your environment.",
  missing_password_config:
    "Password login is not configured yet. Add ADMIN_PASSWORD to your environment.",
  invalid_credentials: "Email or password is incorrect.",
  token_exchange_failed:
    "Google could not complete the sign-in request. Please try again.",
  profile_fetch_failed:
    "Could not read your Google profile. Please try again.",
  unauthorized_email:
    "This Google account is not allowed to access the admin panel.",
};

export default async function AdminLoginPage({ searchParams }) {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  const params = await searchParams;
  const error = params?.error;
  const nextPath =
    typeof params?.next === "string" &&
    params.next.startsWith("/") &&
    !params.next.startsWith("//")
      ? params.next
      : "/admin";
  const message = errorMessages[error];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-600">
          Admin Access
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-950">
          Admin Login
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Sign in with your admin email and password to manage products, blogs,
          analytics, and the hero slider.
        </p>

        {message ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </div>
        ) : null}

        <form action="/api/auth/login" method="post" className="mt-8 space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-950 outline-none transition-colors focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-950 outline-none transition-colors focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-teal-600 px-5 py-3 font-bold text-white transition-colors hover:bg-teal-700"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
            or
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Link
          href="/api/auth/google/start"
          prefetch={false}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-gray-950 px-5 py-3 font-bold text-white transition-colors hover:bg-gray-800"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-black text-gray-950">
            G
          </span>
          Continue with Google
        </Link>
      </div>
    </div>
  );
}
