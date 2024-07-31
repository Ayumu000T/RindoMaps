<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * difficultiesテーブルのデータ内容
 * DatabaseSeeder.phpで呼び出してDBに挿入
 */
class DifficultiesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('difficulties')->insert([
            ['difficulty' => 1, 'display_difficulty' => '★','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['difficulty' => 2, 'display_difficulty' => '★★','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['difficulty' => 3, 'display_difficulty' => '★★★','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['difficulty' => 4, 'display_difficulty' => '★★★★','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['difficulty' => 5, 'display_difficulty' => '★★★★★','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
