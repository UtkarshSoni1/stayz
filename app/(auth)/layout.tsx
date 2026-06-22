export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl">
        {children}
      </div>
    </main>
  );
}