import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import NoData from "../../components/NoData";
import { formatDate2 } from "../../lib/utils";

const getStatusBadge = (status) => {
  const statusConfig = {
    dalam_perjalanan: {
      bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      text: "text-yellow-700 dark:text-yellow-300",
      label: "Dalam Perjalanan",
    },
    diserahkan: {
      bg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      text: "text-green-700 dark:text-green-300",
      label: "Diserahkan",
    },
    diterima: {
      bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      text: "text-blue-700 dark:text-blue-300",
      label: "Diterima",
    },
  };

  const config = statusConfig[status] || statusConfig.dalam_perjalanan;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

const dummyData = [
  {
    id: 1,
    pengajuan_id: 101,
    poktan: "Poktan Makmur",
    kecamatan: "Kecamatan A",
    alsintan: "Traktor Roda 4",
    jumlah_diterima: 2,
    tanggal_distribusi: "03/10/2025",
    lokasi_penyerahan: "Balai Desa A",
    status_distribusi: "dalam_perjalanan",
    status_badge: "Dalam Perjalanan",
    distributor: "PT Agro Sejahtera",
    catatan: "Sedang menuju lokasi",
  },
  {
    id: 2,
    pengajuan_id: 102,
    poktan: "Poktan Sejahtera",
    kecamatan: "Kecamatan B",
    alsintan: "Mesin Panen",
    jumlah_diterima: 1,
    tanggal_distribusi: "02/10/2025",
    lokasi_penyerahan: "Gudang Kecamatan B",
    status_distribusi: "diserahkan",
    status_badge: "Diserahkan",
    distributor: "PT Tani Jaya",
    catatan: "Sudah diserahkan kepada ketua Poktan",
  },
  {
    id: 3,
    pengajuan_id: 103,
    poktan: "Poktan Tunas Harapan",
    kecamatan: "Kecamatan C",
    alsintan: "Pompa Air",
    jumlah_diterima: 3,
    tanggal_distribusi: "01/10/2025",
    lokasi_penyerahan: "Kantor Dinas Pertanian",
    status_distribusi: "diterima",
    status_badge: "Diterima",
    distributor: "System",
    catatan: "Sudah diterima dan digunakan",
  },
];

function DataStatusDistribusi() {
  const [currentPage, setCurrentPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulasi fetch data - ganti dengan API call yang sebenarnya
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // TODO: Ganti dengan endpoint Laravel Anda
      // const response = await fetch("/api/recommendations?limit=50"); // sesuaikan URL
      // const result = await response.json();
      // if (result.success) {
      //   setDatas(result.data.recommendations);
      // }

      // Sementara menggunakan dummy data
      setTimeout(() => {
        setDatas(dummyData);
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
    <>
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Rekomendasi SMART
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Data rekomendasi SMART berdasarkan kriteria yang telah ditentukan
          </p>
        </header>
        <div className="p-3 overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-2 py-3 text-left">No</th>
                <th className="px-2 py-3 text-left">Poktan</th>
                <th className="px-2 py-3 text-left">Kecamatan</th>
                <th className="px-2 py-3 text-left">Alsintan</th>
                <th className="px-2 py-3 text-left">Jumlah</th>
                <th className="px-2 py-3 text-left">Tanggal Distribusi</th>
                <th className="px-2 py-3 text-left">Lokasi Penyerahan</th>
                <th className="px-2 py-3 text-left">Distributor</th>
                <th className="px-2 py-3 text-left">Catatan</th>
                <th className="px-2 py-3 text-left">Status</th>
                <th className="px-2 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-2 text-gray-600 dark:text-gray-400">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-2 py-3 text-left">{item.poktan}</td>
                    <td className="px-2 py-3 text-left">{item.kecamatan}</td>
                    <td className="px-2 py-3 text-left">{item.alsintan}</td>
                    <td className="px-2 py-3 text-left">
                      {item.jumlah_diterima}
                    </td>
                    <td className="px-2 py-3 text-left">
                      {formatDate2(item.tanggal_distribusi)}
                    </td>
                    <td className="px-2 py-3 text-left">
                      {item.lokasi_penyerahan}
                    </td>
                    <td className="px-2 py-3 text-left">{item.distributor}</td>
                    <td className="px-2 py-3 text-left">{item.catatan}</td>
                    <td className="p-2 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <NoData label="Tidak ada data rekomendasi" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
    </>
  );
}

export default DataStatusDistribusi;
