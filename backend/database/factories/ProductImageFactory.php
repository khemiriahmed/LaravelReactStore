<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductImage>
 */
class ProductImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           'image_path' => 'https://picsum.photos/640/480?random=' . rand(1, 10000),
            //    'image_path' => $this->faker->imageUrl(640, 480, 'products', true),
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
