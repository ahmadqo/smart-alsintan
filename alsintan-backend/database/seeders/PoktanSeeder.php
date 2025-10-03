<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Poktan;
use App\Models\Kecamatan;

class PoktanSeeder extends Seeder
{
    public function run()
    {
        $kecamatans = Kecamatan::all();

        if ($kecamatans->count() == 0) {
            $this->command->warn('No Kecamatan found. Please run KecamatanSeeder first.');
            return;
        }

        $samplePoktans = [
            [
                'nama_poktan' => 'Sari Tani Makmur',
                'ketua_poktan' => 'Bapak Sukarno',
                'alamat' => 'Desa Bendosari RT 05 RW 02',
                'desa_kelurahan' => 'Bendosari',
                'no_telepon' => '081234567890',
                'jumlah_anggota' => 35,
                'luas_garapan' => 15.5,
                'jenis_komoditas' => 'Padi',
                'tahun_pembentukan' => 2018
            ],
            [
                'nama_poktan' => 'Maju Bersama',
                'ketua_poktan' => 'Ibu Siti Aminah',
                'alamat' => 'Desa Kradenan RT 10 RW 05',
                'desa_kelurahan' => 'Kradenan',
                'no_telepon' => '081234567891',
                'jumlah_anggota' => 28,
                'luas_garapan' => 12.0,
                'jenis_komoditas' => 'Jagung',
                'tahun_pembentukan' => 2019
            ],
            [
                'nama_poktan' => 'Harapan Jaya',
                'ketua_poktan' => 'Bapak Sutrisno',
                'alamat' => 'Desa Jotang RT 15 RW 08',
                'desa_kelurahan' => 'Jotang',
                'no_telepon' => '081234567892',
                'jumlah_anggota' => 42,
                'luas_garapan' => 18.2,
                'jenis_komoditas' => 'Padi',
                'tahun_pembentukan' => 2015
            ],
            [
                'nama_poktan' => 'Subur Sejahtera',
                'ketua_poktan' => 'Bapak Wagiman',
                'alamat' => 'Desa Trucuk RT 08 RW 03',
                'desa_kelurahan' => 'Trucuk',
                'no_telepon' => '081234567893',
                'jumlah_anggota' => 31,
                'luas_garapan' => 14.8,
                'jenis_komoditas' => 'Kedelai',
                'tahun_pembentukan' => 2017
            ],
            [
                'nama_poktan' => 'Tani Mandiri',
                'ketua_poktan' => 'Ibu Tutik Wahyuni',
                'alamat' => 'Desa Wonosari RT 12 RW 06',
                'desa_kelurahan' => 'Wonosari',
                'no_telepon' => '081234567894',
                'jumlah_anggota' => 25,
                'luas_garapan' => 8.5,
                'jenis_komoditas' => 'Sayuran',
                'tahun_pembentukan' => 2020
            ]
        ];

        foreach ($samplePoktans as $index => $poktanData) {
            // Assign random kecamatan or cycle through available kecamatans
            $kecamatan = $kecamatans[$index % $kecamatans->count()];

            Poktan::create(array_merge($poktanData, [
                'kecamatan_id' => $kecamatan->id,
                'status_aktif' => true
            ]));
        }

        $this->command->info('Sample Poktan data seeded successfully! Total: ' . count($samplePoktans));
    }
}
