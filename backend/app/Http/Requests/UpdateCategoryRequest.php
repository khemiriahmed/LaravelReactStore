<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('category'); // important

        return [
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
        ];
    }
}

