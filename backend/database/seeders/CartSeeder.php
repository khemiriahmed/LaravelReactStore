<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
       public function run(): void
    {
        $users = User::all();
        $products = Product::all();

        foreach ($users as $user) {

            // 1 cart par user
            $cart = Cart::create([
                'user_id' => $user->id
            ]);

            // 1 à 5 items par cart
            $randomProducts = $products->random(rand(1, 5));

            foreach ($randomProducts as $product) {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 3)
                ]);
            }
        }
    }
}
