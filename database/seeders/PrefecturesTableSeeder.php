<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * prefecturesテーブルのデータ内容
 * DatabaseSeeder.phpで呼び出してDBに挿入
 */
class PrefecturesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('prefectures')->insert([
            ['prefecture' => 'Tokyo', 'display_prefecture' => '東京都','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['prefecture' => 'Saitama', 'display_prefecture' => '埼玉県','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['prefecture' => 'Gunma', 'display_prefecture' => '群馬県','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['prefecture' => 'Yamanashi', 'display_prefecture' => '山梨県','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['prefecture' => 'Nagano', 'display_prefecture' => '長野県','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
