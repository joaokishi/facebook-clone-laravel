
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('friendships', function (Blueprint $table) {
            $table->id();
            // User who sent the request
            $table->foreignId('requester_id')->constrained('users')->onDelete('cascade');
            // User who received the request
            $table->foreignId('addressee_id')->constrained('users')->onDelete('cascade');
            // Status of the friendship
            $table->enum('status', ['pending', 'accepted', 'blocked'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('friendships');
    }
};