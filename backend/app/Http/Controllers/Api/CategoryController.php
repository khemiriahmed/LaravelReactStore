<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;

class CategoryController extends Controller
{

//route model binding (Category $category)
   
//  GET all
    public function index()
    {
        return response()->json(Category::latest()->get());   // 1. Récupérer catégories //2. Trier par date (desc) //3. Exécuter requête //4. Retourner JSON
    }

    //  CREATE
    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create([
            ...$request->validated(),
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Category created',
            'data' => $category
        ], 201);
    }

    //  SHOW
    public function show(Category $category)
    {
        return response()->json(
            $category->load('products') //load charger la relation product
        );
    }

    //  UPDATE
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update([
            ...$request->validated(),
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'message' => 'Category updated',
            'data' => $category
        ]);
    }

    //  DELETE
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted'
        ]);
    }
}