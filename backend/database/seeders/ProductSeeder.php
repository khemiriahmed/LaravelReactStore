<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::factory()
            ->count(50)
            ->create()
            ->each(function ($product) {

                // Ajouter entre 1 et 3 images par produit
                ProductImage::factory()
                    ->count(rand(1, 3))
                    ->create([
                        'product_id' => $product->id,
                    ]);
            });
    }
}
