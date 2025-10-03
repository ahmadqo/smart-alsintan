<?php

namespace Database\Seeders;

use App\Models\Alsintan;
use Illuminate\Database\Seeder;

class AlsintanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alsintans = [
            [
                'nama_alsintan' => 'Traktor Roda Empat 4WD',
                'kategori' => 'Traktor',
                'spesifikasi' => '65 HP, 4 Wheel Drive, Transmisi Manual, Diesel Engine',
                'harga_satuan' => 450000000,
                'satuan' => 'unit',
                'deskripsi' => 'Traktor roda empat untuk pengolahan lahan sawah dan ladang skala besar'
            ],
            [
                'nama_alsintan' => 'Hand Traktor Quick G1000',
                'kategori' => 'Hand Tractor',
                'spesifikasi' => '8-12 HP, Mesin Diesel, Roda Besi, Start Elektrik',
                'harga_satuan' => 25000000,
                'satuan' => 'unit',
                'deskripsi' => 'Traktor tangan untuk pengolahan lahan sawah skala kecil-menengah'
            ],
            [
                'nama_alsintan' => 'Rice Transplanter 6 Baris',
                'kategori' => 'Transplanter',
                'spesifikasi' => '6 Baris, Self Propelled, Kapasitas 0.5 Ha/hari, Diesel Engine',
                'harga_satuan' => 85000000,
                'satuan' => 'unit',
                'deskripsi' => 'Mesin tanam padi otomatis untuk meningkatkan efisiensi penanaman'
            ],
            [
                'nama_alsintan' => 'Combine Harvester Mini',
                'kategori' => 'Harvester',
                'spesifikasi' => 'Self Propelled, Kapasitas 1 Ha/hari, Track Type, Complete Unit',
                'harga_satuan' => 750000000,
                'satuan' => 'unit',
                'deskripsi' => 'Mesin panen padi lengkap dengan system pemisahan gabah'
            ],
            [
                'nama_alsintan' => 'Pompa Air Centrifugal 3 Inch',
                'kategori' => 'Water Pump',
                'spesifikasi' => '5.5 HP, Diesel Engine, Kapasitas 840 L/menit, Portable',
                'harga_satuan' => 15000000,
                'satuan' => 'unit',
                'deskripsi' => 'Pompa air untuk irigasi sawah dan pengairan lahan pertanian'
            ],
            [
                'nama_alsintan' => 'Sprayer Gendong Solo',
                'kategori' => 'Sprayer',
                'spesifikasi' => 'Manual, Kapasitas 15 Liter, Pressure 3 Bar, Lance Adjustable',
                'harga_satuan' => 2500000,
                'satuan' => 'unit',
                'deskripsi' => 'Alat semprot untuk aplikasi pestisida dan pupuk cair'
            ],
            [
                'nama_alsintan' => 'Mesin Perontok Padi (Thresher)',
                'kategori' => 'Thresher',
                'spesifikasi' => '5.5 HP, Kapasitas 800 Kg/jam, Portable, Include Blower',
                'harga_satuan' => 18000000,
                'satuan' => 'unit',
                'deskripsi' => 'Mesin perontok gabah untuk memisahkan bulir padi dari tangkainya'
            ],
            [
                'nama_alsintan' => 'Cultivator 9 Mata',
                'kategori' => 'Cultivator',
                'spesifikasi' => 'Lebar Kerja 120 cm, 9 Mata Bajak, Adjustable Depth, Heavy Duty',
                'harga_satuan' => 8000000,
                'satuan' => 'unit',
                'deskripsi' => 'Alat pengolah tanah untuk persiapan lahan tanam'
            ],
            [
                'nama_alsintan' => 'Seeder/Planter 4 Baris',
                'kategori' => 'Seeder',
                'spesifikasi' => '4 Baris, Adjustable Spacing, Manual Feed, Multi Crop',
                'harga_satuan' => 12000000,
                'satuan' => 'unit',
                'deskripsi' => 'Mesin tanam benih untuk berbagai jenis tanaman'
            ],
            [
                'nama_alsintan' => 'Rice Milling Unit Lengkap',
                'kategori' => 'Rice Milling',
                'spesifikasi' => 'Kapasitas 1000 Kg/jam, Complete Unit with Dryer, Cleaner',
                'harga_satuan' => 125000000,
                'satuan' => 'unit',
                'deskripsi' => 'Unit penggilingan padi lengkap dengan pengering dan pembersih'
            ],
            [
                'nama_alsintan' => 'Power Sprayer',
                'kategori' => 'Sprayer',
                'spesifikasi' => '3 HP Engine, Kapasitas Tank 100L, High Pressure, Mobile',
                'harga_satuan' => 8500000,
                'satuan' => 'unit',
                'deskripsi' => 'Sprayer bermotor untuk area luas dan aplikasi cepat'
            ],
            [
                'nama_alsintan' => 'Corn Sheller',
                'kategori' => 'Corn Sheller',
                'spesifikasi' => '2 HP Motor, Kapasitas 300 Kg/jam, Portable, Electric',
                'harga_satuan' => 7500000,
                'satuan' => 'unit',
                'deskripsi' => 'Mesin pemipil jagung untuk memisahkan biji dari tongkolnya'
            ],
            [
                'nama_alsintan' => 'Disc Harrow',
                'kategori' => 'Harrow',
                'spesifikasi' => '16 Disc, Diameter 20 inch, Heavy Duty Frame, Adjustable',
                'harga_satuan' => 15500000,
                'satuan' => 'unit',
                'deskripsi' => 'Alat pengolah tanah dengan piringan untuk memecah gumpalan tanah'
            ],
            [
                'nama_alsintan' => 'Rotary Tiller',
                'kategori' => 'Rotary Tiller',
                'spesifikasi' => 'Lebar Kerja 125cm, Heavy Duty Blade, Gear Box Transmission',
                'harga_satuan' => 22000000,
                'satuan' => 'unit',
                'deskripsi' => 'Mesin pengolah tanah rotary untuk persiapan lahan yang sempurna'
            ],
            [
                'nama_alsintan' => 'Mesin Pemotong Rumput',
                'kategori' => 'Mower',
                'spesifikasi' => '5.5 HP, Self Propelled, Cutting Width 60cm, Mulching System',
                'harga_satuan' => 12500000,
                'satuan' => 'unit',
                'deskripsi' => 'Mesin pemotong rumput untuk pemeliharaan area pertanian'
            ]
        ];

        foreach ($alsintans as $alsintan) {
            Alsintan::create($alsintan);
        }

        $this->command->info('Alsintan data seeded successfully! Total: ' . count($alsintans));
    }
}
