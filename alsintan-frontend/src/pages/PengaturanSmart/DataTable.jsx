import { useEffect, useState } from "react";
import ButtonActionTable from "../../components/ButtonActionTable";
import Pagination from "../../components/Pagination";
import ButtonAdd from "../../components/ButtonAdd";
import NoData from "../../components/NoData";

const dummyKriteria = [
  {
    id: 1,
    nama_kriteria: "Riwayat Penerimaan",
    deskripsi:
      "Menilai berapa lama poktan tidak menerima bantuan alsintan. Semakin lama tidak menerima bantuan, semakin tinggi prioritasnya.",
    bobot_persen: 30.0,
    tipe_data: "numeric",
    nilai_min: 0,
    nilai_max: 100,
    is_active: true,
  },
  {
    id: 2,
    nama_kriteria: "Jumlah Anggota",
    deskripsi:
      "Menilai jumlah anggota aktif dalam poktan. Semakin banyak anggota, semakin besar dampak bantuan yang diberikan.",
    bobot_persen: 20.0,
    tipe_data: "numeric",
    nilai_min: 0,
    nilai_max: 100,
    is_active: true,
  },
  {
    id: 3,
    nama_kriteria: "Luas Garapan",
    deskripsi:
      "Menilai total luas lahan garapan poktan. Luas garapan yang lebih besar menunjukkan kebutuhan alsintan yang lebih tinggi.",
    bobot_persen: 25.0,
    tipe_data: "numeric",
    nilai_min: 0,
    nilai_max: 100,
    is_active: true,
  },
  {
    id: 4,
    nama_kriteria: "Umur Poktan",
    deskripsi:
      "Menilai lama poktan berdiri dan tingkat pengalaman. Poktan yang lebih berpengalaman dinilai lebih mampu mengelola alsintan dengan baik.",
    bobot_persen: 15.0,
    tipe_data: "numeric",
    nilai_min: 0,
    nilai_max: 100,
    is_active: true,
  },
  {
    id: 5,
    nama_kriteria: "Kesesuaian Alsintan",
    deskripsi:
      "Menilai kesesuaian jenis alsintan yang diminta dengan jenis komoditas yang diusahakan oleh poktan.",
    bobot_persen: 10.0,
    tipe_data: "categorical",
    nilai_min: 0,
    nilai_max: 100,
    is_active: true,
  },
];

function DataTableKriteria() {
  const [currentPage, setCurrentPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulasi fetch data - ganti dengan API call yang sebenarnya
    fetchKriteria();
  }, []);

  const fetchKriteria = async () => {
    setLoading(true);
    try {
      // TODO: Ganti dengan endpoint Laravel Anda
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setDatas(data);

      // Sementara menggunakan dummy data
      setTimeout(() => {
        setDatas(dummyKriteria);
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
            Kriteria Penilaian SMART
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Daftar kriteria untuk penilaian kelayakan penerima bantuan alsintan
          </p>
        </div>
        <ButtonAdd label={"Tambah Kriteria"} />
      </header>

      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-2 py-3 text-left w-12">No</th>
                <th className="px-2 py-3 text-left">Nama Kriteria</th>
                <th className="px-2 py-3 text-left">Deskripsi</th>
                <th className="px-2 py-3 text-center">Bobot (%)</th>
                <th className="px-2 py-3 text-center">Tipe Data</th>
                <th className="px-2 py-3 text-center">Range</th>
                <th className="px-2 py-3 text-center">Status</th>
                <th className="px-2 py-3 text-center">Actions</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {currentItems.length > 0 ? (
                currentItems.map((kriteria, index) => (
                  <tr
                    key={kriteria.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-2 text-gray-600 dark:text-gray-400">
                      {startIndex + index + 1}
                    </td>
                    <td className="p-2">
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {kriteria.nama_kriteria}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-gray-600 dark:text-gray-400 max-w-md line-clamp-2">
                        {kriteria.deskripsi}
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold">
                        {kriteria.bobot_persen}%
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          kriteria.tipe_data === "numeric"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        }`}
                      >
                        {kriteria.tipe_data === "numeric"
                          ? "Numerik"
                          : "Kategorikal"}
                      </span>
                    </td>
                    <td className="p-2 text-center text-gray-600 dark:text-gray-400">
                      <span className="font-mono text-xs">
                        {kriteria.nilai_min} - {kriteria.nilai_max}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          kriteria.is_active
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {kriteria.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="p-2 flex justify-center">
                      <ButtonActionTable isEdit isRemove />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <NoData label="Tidak ada data kriteria" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Bobot Info */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Bobot Kriteria
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {datas.reduce((sum, k) => sum + k.bobot_persen, 0)}%
            </div>
          </div>
          {datas.reduce((sum, k) => sum + k.bobot_persen, 0) !== 100 && (
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Peringatan: Total bobot harus 100%
            </div>
          )}
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

export default DataTableKriteria;
