import { useEffect, useState } from "react";
import ButtonActionTable from "../../components/ButtonActionTable";
import Pagination from "../../components/Pagination";
import ButtonAdd from "../../components/ButtonAdd";
import NoData from "../../components/NoData";

const dummyPoktan = [
  {
    id: "1",
    nama: "Poktan Makmur Jaya",
    ketua: "Budi Santoso",
    kecamatan: "Kecamatan Sukamaju",
    jumlahAnggota: 35,
    luasGarapan: "12 Ha",
    status: "Aktif",
  },
  {
    id: "2",
    nama: "Poktan Tani Subur",
    ketua: "Siti Aminah",
    kecamatan: "Kecamatan Harapan Baru",
    jumlahAnggota: 28,
    luasGarapan: "8 Ha",
    status: "Tidak Aktif",
  },
  {
    id: "3",
    nama: "Poktan Sejahtera",
    ketua: "Ahmad Fauzi",
    kecamatan: "Kecamatan Cemerlang",
    jumlahAnggota: 42,
    luasGarapan: "15 Ha",
    status: "Aktif",
  },
];

function DataTablePoktan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulasi fetch data - ganti dengan API call yang sebenarnya
    fetchPoktan();
  }, []);

  const fetchPoktan = async () => {
    setLoading(true);
    try {
      // TODO: Ganti dengan endpoint Laravel Anda
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setDatas(data);

      // Sementara menggunakan dummy data
      setTimeout(() => {
        setDatas(dummyPoktan);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalItems = datas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = datas.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Data Kelompok Tani
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Berikut adalah data kelompok tani yang terdaftar dalam sistem.
          </p>
        </div>
        <ButtonAdd label="Tambah Kelompok Tani" />
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-2 py-3 text-left">No</th>
                <th className="px-2 py-3 whitespace-nowrap text-left">
                  Nama Poktan
                </th>
                <th className="px-2 py-3 whitespace-nowrap text-left">
                  Ketua Poktan
                </th>
                <th className="px-2 py-3 whitespace-nowrap text-left">
                  Kecamatan
                </th>
                <th className="px-2 py-3 whitespace-nowrap text-left">
                  Jumlah Anggota
                </th>
                <th className="px-2 py-3 whitespace-nowrap text-left">
                  Luas Garapan
                </th>
                <th className="px-2 py-3 whitespace-nowrap text-center">
                  Status
                </th>
                <th className="px-2 py-3 whitespace-nowrap text-center">
                  Actions
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {currentItems.length > 0 ? (
                currentItems.map((poktan, index) => (
                  <tr
                    key={poktan.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-2">{startIndex + index + 1}</td>
                    <td className="p-2 whitespace-nowrap">{poktan.nama}</td>
                    <td className="p-2 whitespace-nowrap">{poktan.ketua}</td>
                    <td className="p-2 whitespace-nowrap">
                      {poktan.kecamatan}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {poktan.jumlahAnggota}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {poktan.luasGarapan}
                    </td>
                    <td className="p-2 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          poktan.status === "Aktif"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {poktan.status}
                      </span>
                    </td>
                    <td className="p-2 flex justify-center">
                      <ButtonActionTable isView isEdit isRemove />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <NoData label="Tidak ada data poktan" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {datas.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default DataTablePoktan;
