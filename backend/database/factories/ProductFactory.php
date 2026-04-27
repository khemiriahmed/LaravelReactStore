<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        return [
            'name' => $this->faker->word(),
            'slug' => Str::slug($name),
            'category_id' => \App\Models\Category::inRandomOrder()->first()?->id ?? 1,
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'sku' => strtoupper(Str::random(8)),
            'quantity' => $this->faker->numberBetween(0, 100),
        ];
    }
}
