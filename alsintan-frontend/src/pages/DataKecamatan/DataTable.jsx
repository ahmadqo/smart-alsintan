import { useEffect, useState } from "react";
import ButtonActionTable from "../../components/ButtonActionTable";
import Pagination from "../../components/Pagination";
import ButtonAdd from "../../components/ButtonAdd";
import NoData from "../../components/NoData";

const dummyKecamatan = [
  {
    nama_kecamatan: "Klaten Tengah",
    kode_kecamatan: "3310010",
    alamat: "Jl. Pemuda No. 1, Klaten",
    kepala_kecamatan: "Drs. Suharno, M.Si",
  },
  {
    nama_kecamatan: "Klaten Utara",
    kode_kecamatan: "3310020",
    alamat: "Jl. Merbabu No. 15, Klaten Utara",
    kepala_kecamatan: "Dra. Siti Maryam",
  },
  {
    nama_kecamatan: "Klaten Selatan",
    kode_kecamatan: "3310030",
    alamat: "Jl. Raya Selatan No. 25, Klaten Selatan",
    kepala_kecamatan: "Ir. Bambang Sutrisno",
  },
  {
    nama_kecamatan: "Trucuk",
    kode_kecamatan: "3310040",
    alamat: "Jl. Raya Trucuk No. 12, Trucuk",
    kepala_kecamatan: "Drs. Agung Wijayanto",
  },
  {
    nama_kecamatan: "Juwiring",
    kode_kecamatan: "3310050",
    alamat: "Jl. Juwiring Raya No. 8, Juwiring",
    kepala_kecamatan: "Sri Wahyuningsih, S.Sos",
  },
  {
    nama_kecamatan: "Wonosari",
    kode_kecamatan: "3310060",
    alamat: "Jl. Wonosari No. 20, Wonosari",
    kepala_kecamatan: "Drs. Haryanto, M.M",
  },
  {
    nama_kecamatan: "Delanggu",
    kode_kecamatan: "3310070",
    alamat: "Jl. Delanggu Raya No. 5, Delanggu",
    kepala_kecamatan: "Ir. Slamet Riyadi",
  },
  {
    nama_kecamatan: "Polanharjo",
    kode_kecamatan: "3310080",
    alamat: "Jl. Polanharjo No. 18, Polanharjo",
    kepala_kecamatan: "Dra. Endang Susilowati",
  },
  {
    nama_kecamatan: "Karanganom",
    kode_kecamatan: "3310090",
    alamat: "Jl. Karanganom Raya No. 7, Karanganom",
    kepala_kecamatan: "Drs. Mulyono",
  },
  {
    nama_kecamatan: "Tulung",
    kode_kecamatan: "3310100",
    alamat: "Jl. Tulung No. 14, Tulung",
    kepala_kecamatan: "Ir. Sutrisno, M.T",
  },
  {
    nama_kecamatan: "Jatinom",
    kode_kecamatan: "3310110",
    alamat: "Jl. Jatinom Raya No. 9, Jatinom",
    kepala_kecamatan: "Dra. Puji Astuti",
  },
  {
    nama_kecamatan: "Prambanan",
    kode_kecamatan: "3310120",
    alamat: "Jl. Prambanan No. 22, Prambanan",
    kepala_kecamatan: "Drs. Wahyu Purnomo",
  },
  {
    nama_kecamatan: "Gantiwarno",
    kode_kecamatan: "3310130",
    alamat: "Jl. Gantiwarno No. 11, Gantiwarno",
    kepala_kecamatan: "Ir. Supardi, M.Si",
  },
  {
    nama_kecamatan: "Wedi",
    kode_kecamatan: "3310140",
    alamat: "Jl. Wedi Raya No. 16, Wedi",
    kepala_kecamatan: "Dra. Tri Wulandari",
  },
  {
    nama_kecamatan: "Bayat",
    kode_kecamatan: "3310150",
    alamat: "Jl. Bayat No. 6, Bayat",
    kepala_kecamatan: "Drs. Joko Santoso",
  },
  {
    nama_kecamatan: "Cawas",
    kode_kecamatan: "3310160",
    alamat: "Jl. Cawas Raya No. 13, Cawas",
    kepala_kecamatan: "Ir. Budiono",
  },
  {
    nama_kecamatan: "Ceper",
    kode_kecamatan: "3310170",
    alamat: "Jl. Ceper No. 19, Ceper",
    kepala_kecamatan: "Dra. Sari Dewi Lestari",
  },
  {
    nama_kecamatan: "Pedan",
    kode_kecamatan: "3310180",
    alamat: "Jl. Pedan Raya No. 10, Pedan",
    kepala_kecamatan: "Drs. Agus Priyanto",
  },
  {
    nama_kecamatan: "Karangdowo",
    kode_kecamatan: "3310190",
    alamat: "Jl. Karangdowo No. 17, Karangdowo",
    kepala_kecamatan: "Ir. Hendra Kusuma",
  },
  {
    nama_kecamatan: "Juwangi",
    kode_kecamatan: "3310200",
    alamat: "Jl. Juwangi Raya No. 21, Juwangi",
    kepala_kecamatan: "Dra. Rina Susilowati",
  },
  {
    nama_kecamatan: "Wonosegoro",
    kode_kecamatan: "3310210",
    alamat: "Jl. Wonosegoro No. 4, Wonosegoro",
    kepala_kecamatan: "Drs. Priyo Utomo",
  },
  {
    nama_kecamatan: "Jogonalan",
    kode_kecamatan: "3310220",
    alamat: "Jl. Jogonalan Raya No. 23, Jogonalan",
    kepala_kecamatan: "Ir. Siti Nurjanah, M.P",
  },
  {
    nama_kecamatan: "Manisrenggo",
    kode_kecamatan: "3310230",
    alamat: "Jl. Manisrenggo No. 15, Manisrenggo",
    kepala_kecamatan: "Drs. Bambang Haryono",
  },
  {
    nama_kecamatan: "Karangnongko",
    kode_kecamatan: "3310240",
    alamat: "Jl. Karangnongko Raya No. 8, Karangnongko",
    kepala_kecamatan: "Dra. Lestari Indrawati",
  },
  {
    nama_kecamatan: "Ngawen",
    kode_kecamatan: "3310250",
    alamat: "Jl. Ngawen No. 26, Ngawen",
    kepala_kecamatan: "Ir. Sutomo, M.Si",
  },
  {
    nama_kecamatan: "Kebonarum",
    kode_kecamatan: "3310260",
    alamat: "Jl. Kebonarum Raya No. 12, Kebonarum",
    kepala_kecamatan: "Drs. Ahmad Fauzi",
  },
];

function DataTableKecamatan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulasi fetch data - ganti dengan API call yang sebenarnya
    fetchKecamatan();
  }, []);

  const fetchKecamatan = async () => {
    setLoading(true);
    try {
      // TODO: Ganti dengan endpoint Laravel Anda
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setDatas(data);

      // Sementara menggunakan dummy data
      setTimeout(() => {
        setDatas(dummyKecamatan);
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
            Data Kecamatan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola data kecamatan
          </p>
        </div>
        <ButtonAdd label="Tambah Kecamatan" />
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-2 py-3 text-left">No</th>
                <th className="px-2 py-3 text-left">Kode Kecamatan</th>
                <th className="px-2 py-3 text-left">Nama Kecamatan</th>
                <th className="px-2 py-3 text-center">Actions</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {currentItems.length > 0 ? (
                currentItems.map((kecamatan, index) => (
                  <tr
                    key={kecamatan.kode_kecamatan}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-2">{startIndex + index + 1}</td>
                    <td className="p-2">{kecamatan.kode_kecamatan}</td>
                    <td className="p-2">{kecamatan.nama_kecamatan}</td>
                    <td className="p-2 flex justify-center">
                      <ButtonActionTable isView isEdit isRemove />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <NoData label="Tidak ada data kecamatan" />
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

export default DataTableKecamatan;
