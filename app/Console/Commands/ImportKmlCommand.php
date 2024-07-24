<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\KMLData;
use Storage;

//htmlのリストやinfoWindowや詳細で扱うデータ
class ImportKmlCommand extends Command
{
    protected $signature = 'kml:import';
    protected $description = 'Import KML data into the database';

    public function handle()
    {
        // 既存のデータを削除（必要に応じて）
        KMLData::truncate();

        // ディレクトリ内のすべてのKMLファイルを取得
        $files = Storage::files('kml_for_info');

        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) == 'kml') {
                $this->importKmlFile(storage_path('app/' . $file));
            }
        }

        $this->info('KML data imported successfully.');
    }

    private function importKmlFile($filePath)
    {
        $contents = file_get_contents($filePath);
        $xml = simplexml_load_string($contents);

        foreach ($xml->Document->Placemark as $placemark) {
            $name = trim((string) $placemark->name);
            $difficulty = isset($placemark->ExtendedData->Data[0]->value) ? trim((string) $placemark->ExtendedData->Data[0]->value) : 'Unknown'; // デフォルト値を設定
            $prefecture = isset($placemark->ExtendedData->Data[1]->value) ? trim((string) $placemark->ExtendedData->Data[1]->value) : 'Unknown';
            $description = trim(preg_replace('/\s+/', ' ', (string) $placemark->description)); // 改行をスペースに置換
            $coordinates = trim(preg_replace('/\s+/', '', (string) $placemark->Point->coordinates)); // 改行を削除



            // データベース内に同じ名前のデータが存在するかチェック
            $existingData = KMLData::where('name', $name)->first();
            if ($existingData) {
                // 既存データを更新
                $existingData->update([
                    'difficulty' => $difficulty,
                    'prefecture' => $prefecture,
                    'description' => $description,
                    'coordinates' => $coordinates,
                ]);
            } else {
                // 新しいデータを作成
                KMLData::create([
                    'name' => $name,
                    'difficulty' => $difficulty,
                    'prefecture' => $prefecture,
                    'description' => $description,
                    'coordinates' => $coordinates,
                ]);
            }
        }
    }
}
