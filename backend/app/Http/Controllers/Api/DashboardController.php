<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalRevenue = Order::where('status', '!=', Order::STATUS_CANCELLED)
            ->where('payment_status', '!=', Order::PAYMENT_REFUNDED)
            ->sum('total');

        $ordersByStatus = Order::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'data' => [
                'users' => User::count(),
                'products' => Product::count(),
                'categories' => Category::count(),
                'orders' => Order::count(),
                'orders_pending' => $ordersByStatus->get(Order::STATUS_PENDING, 0),
                'revenue' => round($totalRevenue, 2),
                'low_stock' => Product::where('quantity', '<=', 5)->count(),
                'inactive_products' => Product::where('is_active', false)->count(),
                'recent_orders' => Order::with('user')->latest()->take(5)->get(),
                'low_stock_products' => Product::with('category')
                    ->where('quantity', '<=', 5)
                    ->orderBy('quantity')
                    ->take(5)
                    ->get(),
                'top_products' => Product::orderByDesc('views_count')->take(5)->get(['id', 'name', 'price', 'views_count']),
            ]
        ]);
    }
}