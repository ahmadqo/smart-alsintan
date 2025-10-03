import { useEffect, useState } from "react";
import ButtonActionTable from "../../components/ButtonActionTable";
import Pagination from "../../components/Pagination";
import ButtonAdd from "../../components/ButtonAdd";
import NoData from "../../components/NoData";

const alsintanList = [
  {
    nama_alsintan: "Traktor Roda Empat 4WD",
    kategori: "Traktor",
    spesifikasi: "65 HP, 4 Wheel Drive, Transmisi Manual, Diesel Engine",
    harga_satuan: 450000000,
    satuan: "unit",
    deskripsi:
      "Traktor roda empat untuk pengolahan lahan sawah dan ladang skala besar",
  },
  {
    nama_alsintan: "Hand Traktor Quick G1000",
    kategori: "Hand Tractor",
    spesifikasi: "8-12 HP, Mesin Diesel, Roda Besi, Start Elektrik",
    harga_satuan: 25000000,
    satuan: "unit",
    deskripsi:
      "Traktor tangan untuk pengolahan lahan sawah skala kecil-menengah",
  },
  {
    nama_alsintan: "Rice Transplanter 6 Baris",
    kategori: "Transplanter",
    spesifikasi:
      "6 Baris, Self Propelled, Kapasitas 0.5 Ha/hari, Diesel Engine",
    harga_satuan: 85000000,
    satuan: "unit",
    deskripsi:
      "Mesin tanam padi otomatis untuk meningkatkan efisiensi penanaman",
  },
  {
    nama_alsintan: "Combine Harvester Mini",
    kategori: "Harvester",
    spesifikasi:
      "Self Propelled, Kapasitas 1 Ha/hari, Track Type, Complete Unit",
    harga_satuan: 750000000,
    satuan: "unit",
    deskripsi: "Mesin panen padi lengkap dengan system pemisahan gabah",
  },
  {
    nama_alsintan: "Pompa Air Centrifugal 3 Inch",
    kategori: "Water Pump",
    spesifikasi: "5.5 HP, Diesel Engine, Kapasitas 840 L/menit, Portable",
    harga_satuan: 15000000,
    satuan: "unit",
    deskripsi: "Pompa air untuk irigasi sawah dan pengairan lahan pertanian",
  },
  {
    nama_alsintan: "Sprayer Gendong Solo",
    kategori: "Sprayer",
    spesifikasi: "Manual, Kapasitas 15 Liter, Pressure 3 Bar, Lance Adjustable",
    harga_satuan: 2500000,
    satuan: "unit",
    deskripsi: "Alat semprot untuk aplikasi pestisida dan pupuk cair",
  },
  {
    nama_alsintan: "Mesin Perontok Padi (Thresher)",
    kategori: "Thresher",
    spesifikasi: "5.5 HP, Kapasitas 800 Kg/jam, Portable, Include Blower",
    harga_satuan: 18000000,
    satuan: "unit",
    deskripsi:
      "Mesin perontok gabah untuk memisahkan bulir padi dari tangkainya",
  },
  {
    nama_alsintan: "Cultivator 9 Mata",
    kategori: "Cultivator",
    spesifikasi:
      "Lebar Kerja 120 cm, 9 Mata Bajak, Adjustable Depth, Heavy Duty",
    harga_satuan: 8000000,
    satuan: "unit",
    deskripsi: "Alat pengolah tanah untuk persiapan lahan tanam",
  },
  {
    nama_alsintan: "Seeder/Planter 4 Baris",
    kategori: "Seeder",
    spesifikasi: "4 Baris, Adjustable Spacing, Manual Feed, Multi Crop",
    harga_satuan: 12000000,
    satuan: "unit",
    deskripsi: "Mesin tanam benih untuk berbagai jenis tanaman",
  },
  {
    nama_alsintan: "Rice Milling Unit Lengkap",
    kategori: "Rice Milling",
    spesifikasi: "Kapasitas 1000 Kg/jam, Complete Unit with Dryer, Cleaner",
    harga_satuan: 125000000,
    satuan: "unit",
    deskripsi: "Unit penggilingan padi lengkap dengan pengering dan pembersih",
  },
  {
    nama_alsintan: "Power Sprayer",
    kategori: "Sprayer",
    spesifikasi: "3 HP Engine, Kapasitas Tank 100L, High Pressure, Mobile",
    harga_satuan: 8500000,
    satuan: "unit",
    deskripsi: "Sprayer bermotor untuk area luas dan aplikasi cepat",
  },
  {
    nama_alsintan: "Corn Sheller",
    kategori: "Corn Sheller",
    spesifikasi: "2 HP Motor, Kapasitas 300 Kg/jam, Portable, Electric",
    harga_satuan: 7500000,
    satuan: "unit",
    deskripsi: "Mesin pemipil jagung untuk memisahkan biji dari tongkolnya",
  },
  {
    nama_alsintan: "Disc Harrow",
    kategori: "Harrow",
    spesifikasi: "16 Disc, Diameter 20 inch, Heavy Duty Frame, Adjustable",
    harga_satuan: 15500000,
    satuan: "unit",
    deskripsi:
      "Alat pengolah tanah dengan piringan untuk memecah gumpalan tanah",
  },
  {
    nama_alsintan: "Rotary Tiller",
    kategori: "Rotary Tiller",
    spesifikasi: "Lebar Kerja 125cm, Heavy Duty Blade, Gear Box Transmission",
    harga_satuan: 22000000,
    satuan: "unit",
    deskripsi:
      "Mesin pengolah tanah rotary untuk persiapan lahan yang sempurna",
  },
  {
    nama_alsintan: "Mesin Pemotong Rumput",
    kategori: "Mower",
    spesifikasi: "5.5 HP, Self Propelled, Cutting Width 60cm, Mulching System",
    harga_satuan: 12500000,
    satuan: "unit",
    deskripsi: "Mesin pemotong rumput untuk pemeliharaan area pertanian",
  },
];

function DataTableAlsintan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulasi fetch data - ganti dengan API call yang sebenarnya
    fetchAlsintan();
  }, []);

  const fetchAlsintan = async () => {
    setLoading(true);
    try {
      // TODO: Ganti dengan endpoint Laravel Anda
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setDatas(data);

      // Sementara menggunakan dummy data
      setTimeout(() => {
        setDatas(alsintanList);
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
            Data Alsintan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola data alat dan mesin pertanian (alsintan)
          </p>
        </div>
        <ButtonAdd label="Tambah Alsintan" />
      </header>

      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-2 py-3 text-left">No</th>
                <th className="px-2 py-3 text-left">Nama Alsintan</th>
                <th className="px-2 py-3 text-left">Kategori</th>
                <th className="px-2 py-3 text-left">Satuan</th>
                {/* <th className="px-2 py-3 text-left">Spesifikasi</th>
                <th className="px-2 py-3 text-left">Deskripsi</th> */}
                <th className="px-2 py-3 text-center">Actions</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-2">{startIndex + index + 1}</td>
                    <td className="p-2 whitespace-nowrap">
                      {item.nama_alsintan}
                    </td>
                    <td className="p-2 whitespace-nowrap">{item.kategori}</td>
                    <td className="p-2 whitespace-nowrap">{item.satuan}</td>
                    {/* <td className="p-2 whitespace-nowrap">{item.spesifikasi}</td>
                  <td className="p-2 whitespace-nowrap">{item.deskripsi}</td> */}
                    <td className="p-2 flex justify-center">
                      <ButtonActionTable isView isEdit isRemove />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <NoData label="Tidak ada data alsintan" />
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

export default DataTableAlsintan;
