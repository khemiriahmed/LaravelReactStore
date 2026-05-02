<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['cart_id', 'product_id', 'quantity'];


    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }
}