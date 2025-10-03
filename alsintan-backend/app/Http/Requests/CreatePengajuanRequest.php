<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreatePengajuanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'poktan_id' => [
                'required',
                'integer',
                Rule::exists('poktan', 'id')->where(function ($query) {
                    $query->where('status_aktif', true);
                })
            ],
            'alsintan_id' => 'required|integer|exists:alsintan,id',
            'jumlah_diminta' => 'required|integer|min:1|max:100',
            'alasan_pengajuan' => 'required|string|min:10|max:1000',
            'tanggal_pengajuan' => 'nullable|date|after_or_equal:today'
        ];
    }

    public function messages()
    {
        return [
            'poktan_id.required' => 'Poktan harus dipilih',
            'poktan_id.exists' => 'Poktan yang dipilih tidak valid atau tidak aktif',
            'alsintan_id.required' => 'Jenis alsintan harus dipilih',
            'alsintan_id.exists' => 'Jenis alsintan yang dipilih tidak valid',
            'jumlah_diminta.required' => 'Jumlah alsintan yang diminta harus diisi',
            'jumlah_diminta.min' => 'Jumlah minimum adalah 1 unit',
            'jumlah_diminta.max' => 'Jumlah maksimum adalah 100 unit',
            'alasan_pengajuan.required' => 'Alasan pengajuan harus diisi',
            'alasan_pengajuan.min' => 'Alasan pengajuan minimal 10 karakter',
            'alasan_pengajuan.max' => 'Alasan pengajuan maksimal 1000 karakter',
            'tanggal_pengajuan.after_or_equal' => 'Tanggal pengajuan tidak boleh kurang dari hari ini'
        ];
    }

    protected function prepareForValidation()
    {
        if (!$this->has('tanggal_pengajuan')) {
            $this->merge([
                'tanggal_pengajuan' => now()->format('Y-m-d')
            ]);
        }
    }
}
