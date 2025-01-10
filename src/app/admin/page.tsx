import { getRegistrations } from "@/lib/actions/registration";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "@/components/admin/columns";
import { ExportButton } from "@/components/admin/export-button";

export default async function AdminPage() {
  const { data: registrations } = await getRegistrations();

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <ExportButton data={registrations} />
      </div>

      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={registrations}
          filterColumn="status"
          filterOptions={statusOptions}
        />
      </div>
    </div>
  );
}
