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
        Schema::table('prefectures', function (Blueprint $table) {
            $table->renameColumn('prefecture', 'prefecture_name');
            $table->renameColumn('display_prefecture', 'display_prefecture_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prefectures', function (Blueprint $table) {
            $table->renameColumn('prefecture_name', 'prefecture');
            $table->renameColumn('display_prefecture_name', 'display_prefecture');
        });
    }
};
