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
        Schema::table('users', function (Blueprint $table) {
        //  téléphone
        $table->string('phone', 20)->nullable()->after('email');

        //  rôle utilisateur
        $table->enum('role', ['customer', 'admin', 'vendor'])
              ->default('customer')
              ->after('password');

        //  statut utilisateur
        $table->enum('status', ['active', 'inactive', 'banned'])
              ->default('active')
              ->after('role');

        //  avatar
        $table->string('avatar')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
              $table->dropColumn(['phone', 'role', 'status', 'avatar']);
        });
    }
};
