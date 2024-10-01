<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use DB;

class DatabaseSeeder extends Seeder
{
    /**
     * テーブルにデータを挿入
     */
    public function run(): void
    {
        // 外部キー制約を無効化
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // テーブルを空にする
        DB::table('difficulties')->truncate(); // difficultiesテーブルを空にする
        DB::table('prefectures')->truncate();  // prefecturesテーブルを空にする

        // 外部キー制約を有効化
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Seederを呼び出す
        $this->call([
            DifficultiesTableSeeder::class, // difficulties(難易度)テーブルへ
            PrefecturesTableSeeder::class,  // prefectures(都道府県)テーブルへ
        ]);
    }
}
