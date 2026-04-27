<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    //  GET all products (pagination)

    public function index(Request $request)
    {
        $query = Product::with(['category', 'images']);

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }
    // public function index()
    // {
    //     $products = Product::with('category', 'images')
    //         ->latest()
    //         ->paginate(10);

    //     return response()->json($products);
    // }



    //  CREATE product
    public function store(StoreProductRequest $request)
    {
        $product = Product::create([
            ...$request->validated(),
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    //  SHOW product (Route Model Binding)
    public function show(Product $product)
    {
        return response()->json(
            $product->load('category', 'images')
        );
    }

    //  UPDATE product
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update([
            ...$request->validated(),
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    //  DELETE product
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}