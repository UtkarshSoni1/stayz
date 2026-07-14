import Link from "next/link";
import { ResendButton } from "@/components/auth/resend-button";

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export const metadata = {
  title: "Check Your Email | StayZ",
};

export default async function VerifyEmailSentPage({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/8 bg-zinc-900 p-8 text-center shadow-2xl">
          {/* Icon */}
          <div className="mb-5 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                  style={{ background: "rgba(96,165,250,0.12)" }}>
              📧
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-2 text-xl font-bold text-white">
            Check your inbox
          </h1>

          {/* Email address */}
          {email && (
            <p className="mb-1 text-sm font-medium text-blue-400">{email}</p>
          )}

          {/* Body */}
          <p className="mb-6 text-sm leading-relaxed text-white/50">
            We&apos;ve sent you a verification link. Click the button in the
            email to activate your account. The link expires in{" "}
            <strong className="text-white/70">24 hours</strong>.
          </p>

          {/* Tips */}
          <div className="mb-6 rounded-xl border border-white/6 bg-white/4 px-4 py-3 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">
              Didn&apos;t receive it?
            </p>
            <ul className="space-y-1 text-xs text-white/45">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you used the correct email address</li>
              <li>• Wait a minute — delivery can take up to 60 seconds</li>
            </ul>
          </div>

          {/* Resend */}
          <ResendButton email={email} label="Resend Verification Email" />

          <div className="mt-4">
            <Link
              href="/login"
              className="text-xs text-white/30 hover:text-white/60 transition"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
