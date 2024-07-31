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
        Schema::create('kml_data', function (Blueprint $table) {
            $table->id();
            $table->string('name'); //林道名
            $table->string('coordinates'); //座標
            $table->foreignId('difficulty_id')->constrained('difficulties'); //難易度の外部キー
            $table->foreignId('prefecture_id')->constrained('prefectures'); //都道府県の外部キー
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kml_data');
    }
};
