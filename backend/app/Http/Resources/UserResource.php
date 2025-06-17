<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth; // <-- Import the Auth facade

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            
            // --- THIS IS THE KEY CHANGE ---
            // Only include the email if the authenticated user is viewing their own profile.
            // For everyone else, this field will be omitted from the API response.
            'email' => $this->when(Auth::id() === $this->id, $this->email),
            
            'joined_at' => $this->created_at->toFormattedDateString(),
        ];
    }
}