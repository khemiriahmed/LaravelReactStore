<?php

namespace App\Http\Controllers\Api\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Request;

class ProductController extends Controller
{
    /**
     * GET all products (pagination, filters)
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images']);

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('featured')) {
            $query->where('is_featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('sort') && $request->sort === 'price_asc') {
            $query->orderBy('price');
        } elseif ($request->has('sort') && $request->sort === 'price_desc') {
            $query->orderByDesc('price');
        } else {
            $query->latest();
        }

        return response()->json(
            $query->paginate($request->get('per_page', 10))
        );
    }

    /**
     * CREATE product + images
     */
    public function store(StoreProductRequest $request)
    {
        try {
            DB::beginTransaction();

            $product = Product::create([
                ...$request->validated(),
                'slug' => Str::slug($request->name),
            ]);

            $this->handleImages($request, $product);

            DB::commit();

            return response()->json([
                'message' => 'Product created successfully',
                'data' => $product->load('category', 'images')
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Product creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * SHOW product (Route Model Binding)
     */
    public function show(Product $product)
    {
        return response()->json(
            $product->load('category', 'images')
        );
    }

    /**
     * UPDATE product + images
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            DB::beginTransaction();

            $product->update([
                ...$request->validated(),
                'slug' => Str::slug($request->name),
            ]);

            $this->handleImages($request, $product);

            DB::commit();

            return response()->json([
                'message' => 'Product updated successfully',
                'data' => $product->load('category', 'images')
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Product update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE product
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Store uploaded images into product_images table.
     */
    private function handleImages($request, Product $product)
    {
        // Single file input named "image" -> becomes the primary image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');

            $product->images()->where('is_primary', true)->update(['is_primary' => false]);

            $product->images()->create([
                'image_path' => $path,
                'is_primary' => true,
            ]);
        }

        // Multiple files input named "images[]"
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');

                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $product->images()->count() === 0,
                ]);
            }
        }
    }
}