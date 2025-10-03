<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SmartCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $criteria = [
            [
                'nama_kriteria' => 'Riwayat Penerimaan',
                'deskripsi' => 'Menilai berapa lama poktan tidak menerima bantuan alsintan. Semakin lama tidak menerima bantuan, semakin tinggi prioritasnya.',
                'bobot_persen' => 30.00,
                'tipe_data' => 'numeric',
                'nilai_min' => 0,
                'nilai_max' => 100,
                'is_active' => true
            ],
            [
                'nama_kriteria' => 'Jumlah Anggota',
                'deskripsi' => 'Menilai jumlah anggota aktif dalam poktan. Semakin banyak anggota, semakin besar dampak bantuan yang diberikan.',
                'bobot_persen' => 20.00,
                'tipe_data' => 'numeric',
                'nilai_min' => 0,
                'nilai_max' => 100,
                'is_active' => true
            ],
            [
                'nama_kriteria' => 'Luas Garapan',
                'deskripsi' => 'Menilai total luas lahan garapan poktan. Luas garapan yang lebih besar menunjukkan kebutuhan alsintan yang lebih tinggi.',
                'bobot_persen' => 25.00,
                'tipe_data' => 'numeric',
                'nilai_min' => 0,
                'nilai_max' => 100,
                'is_active' => true
            ],
            [
                'nama_kriteria' => 'Umur Poktan',
                'deskripsi' => 'Menilai lama poktan berdiri dan tingkat pengalaman. Poktan yang lebih berpengalaman dinilai lebih mampu mengelola alsintan dengan baik.',
                'bobot_persen' => 15.00,
                'tipe_data' => 'numeric',
                'nilai_min' => 0,
                'nilai_max' => 100,
                'is_active' => true
            ],
            [
                'nama_kriteria' => 'Kesesuaian Alsintan',
                'deskripsi' => 'Menilai kesesuaian jenis alsintan yang diminta dengan jenis komoditas yang diusahakan oleh poktan.',
                'bobot_persen' => 10.00,
                'tipe_data' => 'categorical',
                'nilai_min' => 0,
                'nilai_max' => 100,
                'is_active' => true
            ]
        ];

        foreach ($criteria as $criterion) {
            SmartCriteria::create($criterion);
        }

        $this->command->info('SMART Criteria seeded successfully! Total: ' . count($criteria));
        $this->command->info('Total weight: ' . collect($criteria)->sum('bobot_persen') . '%');
    }
}
