<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
    {
        Schema::table('kml_data', function (Blueprint $table) {
            $table->string('romaji_name')->nullable()->after('name');
        });
    }

    public function down()
    {
        Schema::table('kml_data', function (Blueprint $table) {
            $table->dropColumn('romaji_name');
        });
    }
};
