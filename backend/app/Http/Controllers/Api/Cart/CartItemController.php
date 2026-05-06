<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartAddRequest;
use App\Http\Requests\CartUpdateRequest;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class CartItemController extends Controller
{
    /**
     *  Add item to cart
     */
    public function store(CartAddRequest $request)
    {
        $cart = $this->getUserCart();

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
            'message' => 'Item added to cart',
            'data' => $this->getCartWithRelations()
        ]);
    }

    /**
     *  Update quantity
     */
    public function update(CartUpdateRequest $request, $id)
    {
        $item = $this->findUserItem($id);

        $item->update([
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'message' => 'Item updated',
            'data' => $this->getCartWithRelations()
        ]);
    }

    /**
     *  Delete item
     */
    public function destroy($id)
    {
        $item = $this->findUserItem($id);
        $item->delete();

        return response()->json([
            'message' => 'Item removed',
            'data' => $this->getCartWithRelations()
        ]);
    }

    /**
     *  Clear all items
     */
    public function clear()
    {
        $cart = $this->getUserCart();

        $cart->items()->delete();

        return response()->json([
            'message' => 'Cart cleared',
            'data' => $this->getCartWithRelations()
        ]);
    }

    /**
     * =========================
     *  HELPERS
     * =========================
     */

    private function getUserCart()
    {
        return Cart::firstOrCreate([
            'user_id' => Auth::id()
        ]);
    }

    private function getCartWithRelations()
    {
        return Cart::with('items.product.images')
            ->where('user_id', Auth::id())
            ->first();
    }

    private function findUserItem($id)
    {
        return CartItem::whereHas('cart', function ($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);
    }
}