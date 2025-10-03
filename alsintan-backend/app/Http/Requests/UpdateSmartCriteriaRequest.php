<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSmartCriteriaRequest extends FormRequest
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
    public function rules()
    {
        return [
            'criteria' => 'required|array|min:1',
            'criteria.*.id' => 'required|integer|exists:smart_criteria,id',
            'criteria.*.bobot_persen' => 'required|numeric|min:0|max:100',
            'recalculate_all' => 'boolean'
        ];
    }

    public function messages()
    {
        return [
            'criteria.required' => 'Data kriteria harus diisi',
            'criteria.array' => 'Format data kriteria tidak valid',
            'criteria.min' => 'Minimal harus ada 1 kriteria',
            'criteria.*.id.required' => 'ID kriteria harus diisi',
            'criteria.*.id.exists' => 'Kriteria tidak ditemukan',
            'criteria.*.bobot_persen.required' => 'Bobot persen harus diisi',
            'criteria.*.bobot_persen.numeric' => 'Bobot persen harus berupa angka',
            'criteria.*.bobot_persen.min' => 'Bobot persen minimal 0',
            'criteria.*.bobot_persen.max' => 'Bobot persen maksimal 100',
            'recalculate_all.boolean' => 'Parameter recalculate_all harus boolean'
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->has('criteria')) {
                $totalBobot = collect($this->criteria)->sum('bobot_persen');
                if ($totalBobot != 100) {
                    $validator->errors()->add('criteria', 'Total bobot semua kriteria harus 100%. Saat ini: ' . $totalBobot . '%');
                }
            }
        });
    }
}
