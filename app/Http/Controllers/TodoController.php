<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Todo::with("category:id,name")->where('user_id', Auth::id())->get(['id', 'title', 'description', 'is_completed', 'category_id']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make(request()->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id'
        ], [
            'title.required' => 'Title is required.',
            'title.string' => 'Title must be a string.',
            'title.max' => 'Title must not exceed 255 characters.',
            'description.string' => 'Description must be a string.',
            'category_id.exists' => 'The selected category does not exist.'
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $todo = new Todo();
        $todo->title = request()->input('title');
        $todo->description = request()->input('description', '');
        $todo->user_id = Auth::id();
        if ($request->has('category_id')) {
            $todo->category_id = request()->input('category_id');
        }
        $todo->save();

        return response()->json(['message' => 'Todo created successfully.', 'todo' => $todo], 201);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo)
    {
        $validator = Validator::make(request()->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id'
        ], [
            'title.required' => 'Title is required.',
            'title.string' => 'Title must be a string.',
            'title.max' => 'Title must not exceed 255 characters.',
            'description.string' => 'Description must be a string.',
            'category_id.exists' => 'The selected category does not exist.'
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($todo->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $todo->update($request->only(['title', 'description', 'category_id', 'is_completed']));

        return response()->json(['message' => 'Todo updated successfully.', 'todo' => $todo], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $todo->delete();

        return response()->noContent();
    }
}
