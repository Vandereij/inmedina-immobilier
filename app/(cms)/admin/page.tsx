// app/admin/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const nav = [
//   { label: "Dashboard", href: "/admin" },
  { label: "Properties", href: "/admin/properties" },
//   { label: "Posts", href: "/admin/posts" },
//   { label: "Locations", href: "/admin/locations" },
//   { label: "Media", href: "/admin/media" },
//   { label: "Enquiries", href: "/admin/enquiries" },
//   { label: "SEO / Pages", href: "/admin/seo" },
//   { label: "Settings", href: "/admin/settings" },
];

export default async function AdminDashboard() {
  // Later: fetch counts/activity server-side and drop into the cards.
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-[260px_1fr] md:px-8">
        {/* Sidebar */}
        <aside className="md:sticky md:top-6 md:h-[calc(100vh-48px)]">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">CMS</p>
                <p className="text-xs text-muted-foreground">InMedina Admin</p>
              </div>
              <Button size="sm" asChild>
                <Link href="/admin/properties/new">New property</Link>
              </Button>
            </div>

            <div className="mt-4">
              <Input placeholder="Search…" />
            </div>

            <nav className="mt-4 grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="grid gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid gap-1">
              <h1 className="text-2xl font-semibold">CMS Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage properties, posts, media and enquiries.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin/media">Upload media</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/posts/new">New post</Link>
              </Button>
            </div>
          </div>

          {/* KPI cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Properties", value: "—", hint: "Total" },
              { title: "Drafts", value: "—", hint: "Unpublished" },
              { title: "Enquiries", value: "—", hint: "Last 7 days" },
              { title: "Media", value: "—", hint: "Files" },
            ].map((kpi) => (
              <Card key={kpi.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{kpi.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Two-column content */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Needs attention</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Add items like: missing SEO, missing hero image, drafts older than 30d, etc.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Show latest edits/uploads with links back to the item.
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
