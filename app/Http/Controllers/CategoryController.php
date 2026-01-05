<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Category::where('user_id', Auth::id())->get(['id', 'name']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make(request()->all(), [
            'name' => 'required|string|min:1|max:255'
        ], [
            'name.required' => 'Category name is required.',
            'name.string' => 'Category name must be a string.',
            'name.min' => 'Category name must be at least 1 character.',
            'name.max' => 'Category name must not exceed 255 characters.'
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = new Category();
        $category->name = request()->input('name');
        $category->user_id = Auth::id();
        $category->save();

        return response()->json(['message' => 'Category created successfully.', 'category' => $category], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validator = Validator::make(request()->all(), [
            'name' => 'required|string|min:1|max:255'
        ], [
            'name.required' => 'Category name is required.',
            'name.string' => 'Category name must be a string.',
            'name.min' => 'Category name must be at least 1 character.',
            'name.max' => 'Category name must not exceed 255 characters.'
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($category->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $category->name = request()->input('name');
        $category->save();

        return response()->json(['message' => 'Category updated successfully.', 'category' => $category], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Category deeted successfully.'], 200);
    }
}
