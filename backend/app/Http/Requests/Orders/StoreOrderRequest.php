<?php

namespace App\Http\Requests\Orders;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'shipping_name' => 'required|string|max:255',
            'shipping_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:255',
            'shipping_postal_code' => 'nullable|string|max:20',
            'shipping_country' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'payment_method' => 'required|in:cash_on_delivery,card,bank_transfer',
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_name.required' => 'Full name is required',
            'shipping_phone.required' => 'Phone number is required',
            'shipping_address.required' => 'Address is required',
            'shipping_city.required' => 'City is required',
            'payment_method.required' => 'Payment method is required',
            'payment_method.in' => 'Invalid payment method',
        ];
    }
}