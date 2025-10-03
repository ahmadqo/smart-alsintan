import DashboardLayout from "../../components/layouts/DashboardLayout";
import DataTable from "./DataTable";

function PengaturanSmart() {
  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Pengaturan SMART
            </h1>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-12 gap-6">
          <DataTable />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PengaturanSmart;
