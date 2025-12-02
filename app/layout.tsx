// app/layout.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { headers } from "next/headers";
import "./globals.css";
import { createSupabaseServerClient } from "@/lib/auth"; // from your earlier code

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const headersList = await headers();
  const fullUrl = headersList.get("x-url") || headersList.get("referer");
  const pathname = new URL(fullUrl || "").pathname;
  const isCentered: string = (pathname === "/auth" ? "content-center" : "")
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data } = await supabase.rpc("is_admin");
    isAdmin = !!data;
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-[#1e1e1e]">
        <main className="flex flex-col min-h-screen">
          {/* pass admin + user info down */}
          <Header isAdmin={isAdmin} user={user} />
          <section className={`flex-1 ${isCentered}`}>{children}</section>
          <Footer />
        </main>
      </body>
    </html>
  );
}
