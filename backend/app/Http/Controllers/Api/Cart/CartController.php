<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartAddRequest;
use App\Http\Requests\CartUpdateRequest;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     *  Get current user cart
     */
    public function index()
    {
        $cart = Cart::with('items.product.images')
            ->firstOrCreate([
                'user_id' => Auth::id()
            ]);

        return response()->json([
            'data' => $cart
        ]);
    }

    /**
     *  Add product to cart
     */
    public function add(CartAddRequest $request)
    {
        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id()
        ]);

        $item = CartItem::where([
            'cart_id' => $cart->id,
            'product_id' => $request->product_id
        ])->first();

        if ($item) {
            $item->increment('quantity', $request->quantity ?? 1);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity ?? 1
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart',
            'data' => $this->getCart()
        ]);
    }

    /**
     *  Update item quantity
     */
    public function update(CartUpdateRequest $request, $id)
    {
        $item = $this->findUserCartItem($id);

        $item->update([
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'message' => 'Cart updated',
            'data' => $this->getCart()
        ]);
    }

    /**
     *  Remove item
     */
    public function remove($id)
    {
        $item = $this->findUserCartItem($id);
        $item->delete();

        return response()->json([
            'message' => 'Item removed',
            'data' => $this->getCart()
        ]);
    }

    /**
     *  Clear cart
     */
    public function clear()
    {
        $cart = Cart::where('user_id', Auth::id())->first();

        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json([
            'message' => 'Cart cleared',
            'data' => $this->getCart()
        ]);
    }

    /**
     *  Helper: Get cart with relations
     */
    private function getCart()
    {
        return Cart::with('items.product.images')
            ->where('user_id', Auth::id())
            ->first();
    }

    /**
     *  Helper: secure item access
     */
    private function findUserCartItem($id)
    {
        return CartItem::whereHas('cart', function ($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);
    }
}