import { AppNavBar } from "@/components/navbar/AppNavBar";
import { CreditCard } from "lucide-react";

export const metadata = {
  title: "Payments | StayZ",
  description: "Manage your rent payments.",
};

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AppNavBar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <CreditCard className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Payments</h1>
        <p className="text-white/40 text-sm max-w-sm mx-auto">
          Rent payment features are coming soon. You&apos;ll be able to pay rent, view history, and download receipts here.
        </p>
      </main>
    </div>
  );
}
