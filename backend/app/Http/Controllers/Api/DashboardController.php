<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $totalProducts = Product::count();

        $lowStock = Product::where('quantity', '<=', 5)->count();

        $outOfStock = Product::where('quantity', 0)->count();

        $totalStockValue = Product::sum(DB::raw('price * quantity'));

        //$totalSales = Order::sum('total_amount');

        $topProducts = Product::orderBy('quantity', 'asc')
            ->limit(5)
            ->get(['name', 'quantity']);

        return response()->json([
            'total_products' => $totalProducts,
            'low_stock' => $lowStock,
            'out_of_stock' => $outOfStock,
            'stock_value' => $totalStockValue,
            'total_sales' => $totalSales,
            'top_products' => $topProducts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
