import { requireAdmin } from "@/lib/auth";
import NewPropertyForm from "./new-property-form"; // Assuming you move the client component

export default async function NewPropertyPage() {
  // This server-side check now uses the real Supabase session.
  await requireAdmin();

  return <NewPropertyForm />;
}

