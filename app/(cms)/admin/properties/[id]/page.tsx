import { requireAdmin } from "@/lib/auth";
import EditPropertyForm from "./edit-property-form"; // Assuming you move the client component

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  // This protects the route before rendering anything.
  await requireAdmin();

  // The EditProperty component will now only render for authenticated admins.
  return <EditPropertyForm />;
}
