// app/layout.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";
import { createSupabaseServerClient } from "@/lib/auth"; // from your earlier code

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

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
        <main>
          {/* pass admin + user info down */}
          <Header isAdmin={isAdmin} user={user} />
          <section>{children}</section>
          <Footer />
        </main>
      </body>
    </html>
  );
}
