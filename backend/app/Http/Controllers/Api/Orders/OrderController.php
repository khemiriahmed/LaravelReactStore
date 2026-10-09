<?php

namespace App\Http\Controllers\Api\Orders;

use App\Http\Controllers\Controller;
use App\Http\Requests\Orders\StoreOrderRequest;
use App\Http\Requests\Orders\UpdateOrderStatusRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Get current user's orders
     */
    public function index()
    {
        $orders = Order::with('items')
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    /**
     * Get single order (owner only)
     */
    public function show($id)
    {
        $order = Order::with('items')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json(['data' => $order]);
    }

    /**
     * Create an order from the user's cart
     */
    public function store(StoreOrderRequest $request)
    {
        $cart = Cart::with('items.product')
            ->where('user_id', Auth::id())
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty'
            ], 422);
        }

        // Check stock availability first
        foreach ($cart->items as $item) {
            if ($item->quantity > $item->product->quantity) {
                return response()->json([
                    'message' => "Not enough stock for \"{$item->product->name}\" (available: {$item->product->quantity})"
                ], 422);
            }
        }

        try {
            $order = DB::transaction(function () use ($cart, $request) {
                $subtotal = $cart->items->reduce(function ($sum, $item) {
                    return $sum + ($item->quantity * $item->product->price);
                }, 0);

                $shippingCost = 0;
                $total = $subtotal + $shippingCost;

                $paymentMethod = $request->payment_method;
                $paymentStatus = in_array($paymentMethod, ['card', 'bank_transfer'])
                    ? Order::PAYMENT_PAID
                    : Order::PAYMENT_UNPAID;

                $order = Order::create([
                    'user_id' => Auth::id(),
                    'status' => Order::STATUS_PENDING,
                    'payment_status' => $paymentStatus,
                    'payment_method' => $paymentMethod,
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'total' => $total,
                    'shipping_name' => $request->shipping_name,
                    'shipping_phone' => $request->shipping_phone,
                    'shipping_address' => $request->shipping_address,
                    'shipping_city' => $request->shipping_city,
                    'shipping_postal_code' => $request->shipping_postal_code,
                    'shipping_country' => $request->shipping_country ?? 'Tunisia',
                    'notes' => $request->notes,
                ]);

                foreach ($cart->items as $item) {
                    $product = $item->product;

                    $order->items()->create([
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_price' => $product->price,
                        'product_image' => $product->images()->first()?->image_path,
                        'quantity' => $item->quantity,
                        'subtotal' => $item->quantity * $product->price,
                    ]);

                    // Decrement stock
                    $product->decrement('quantity', $item->quantity);
                }

                // Clear the cart
                $cart->items()->delete();

                return $order;
            });

            return response()->json([
                'message' => 'Order placed successfully',
                'data' => $order->load('items')
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Order could not be placed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User cancels a pending order (stock is restored)
     */
    public function cancel($id)
    {
        $order = Order::where('user_id', Auth::id())->findOrFail($id);

        if (!in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_PROCESSING])) {
            return response()->json([
                'message' => 'This order can no longer be cancelled'
            ], 422);
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                if ($item->product_id) {
                    Product::where('id', $item->product_id)->increment('quantity', $item->quantity);
                }
            }

            $order->update(['status' => Order::STATUS_CANCELLED]);
        });

        return response()->json([
            'message' => 'Order cancelled',
            'data' => $order->load('items')
        ]);
    }

    /**
     * ADMIN: list all orders
     */
    public function adminIndex(Request $request)
    {
        $query = Order::with('user', 'items');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('search')) {
            $query->where('order_number', 'like', '%' . $request->search . '%');
        }

        return response()->json(
            $query->latest()->paginate($request->get('per_page', 10))
        );
    }

    /**
     * ADMIN: show order
     */
    public function adminShow($id)
    {
        $order = Order::with('user', 'items')->findOrFail($id);

        return response()->json(['data' => $order]);
    }

    /**
     * ADMIN: update order status
     */
    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $order = Order::findOrFail($id);

        $data = [
            'status' => $request->status,
        ];

        if ($request->has('payment_status')) {
            $data['payment_status'] = $request->payment_status;
        }

        $order->update($data);

        return response()->json([
            'message' => 'Order updated',
            'data' => $order->load('user', 'items')
        ]);
    }
}