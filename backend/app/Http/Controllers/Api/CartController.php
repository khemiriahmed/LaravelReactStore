<?php 

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // 🛒 GET USER CART
    public function index()
    {
        $cart = Cart::with('items.product.images')
            ->firstOrCreate(['user_id' => Auth::id()]);

        return response()->json($cart);
    }

    //  ADD TO CART
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1'
        ]);

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

        return $this->index();
    }

    //  UPDATE QUANTITY
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $item = CartItem::findOrFail($id);
        $item->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Updated']);
    }

    //  REMOVE ITEM
    public function remove($id)
    {
        CartItem::findOrFail($id)->delete();

        return response()->json(['message' => 'Removed']);
    }

    //  CLEAR CART
    public function clear()
    {
        $cart = Cart::where('user_id', Auth::id())->first();

        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json(['message' => 'Cart cleared']);
    }
}