import { AppNavBar } from "@/components/navbar/AppNavBar";
import { FileText, Download } from "lucide-react";

export const metadata = {
  title: "Rental Agreement | StayZ",
  description: "View and download your rental agreement.",
};

export default function AgreementPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AppNavBar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <FileText className="h-8 w-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Rental Agreement</h1>
        <p className="text-white/40 text-sm max-w-sm mx-auto">
          Your rental agreement will appear here once you have an active rental. You&apos;ll be able to download and review it any time.
        </p>
      </main>
    </div>
  );
}
