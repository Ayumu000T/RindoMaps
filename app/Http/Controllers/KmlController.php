<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class KmlController extends Controller
{
    /**
     * マップに表示するkmlレイヤー用のURL
     * 初期ロード時はそのままURLを読み込む
     * ファイルは難易度ごとに別れていて、難易度でのソートではこのまま使うが、
     * 県でのソートの際はソートされたURLを使う
     */
    public function getKmlUrls()
    {
        return response()->json([
            'difficulty1' => 'http://ic21at.oops.jp/kml_test/sorted4.kml',
            // 'difficulty1' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7ynBOV8jQUo',
            // 'difficulty2' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=FHEwq7ut1X8',
            // 'difficulty3' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=rd6pvMc1c1c',
            // 'difficulty4' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7SU8cepGjbg',
            // 'difficulty5' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=2_crKVxfQWY',
        ]);
    }

    /**
     * URLのkmlファイルを取得して、jsに返す
     * サーバー経由でCORSを回避
     * マップのソートにkmlファイルの内容を読み込み解析する必要がある
     */
    public function fetchKml(Request $request)
    {
        //クエリとして渡されたkmlUrlを取得
        $kmlUrl = $request->query('kmlUrl');
        if (!$kmlUrl) {
            return response()->json(['error' => 'No KML URL provided'], 400);
        }

        try {
            // kmlUrlからkmlファイルを取得
            $response = Http::get($kmlUrl);

            //レスポンスチェック
            if ($response->successful()) {
                //成功したらkmlファイルを返す
                return response($response->body(), 200)
                    ->header('Content-Type', 'application/vnd.google-earth.kml+xml');
            } else {
                \Log::error('Failed to fetch KML from external source: ' . $response->status());
                return response()->json(['error' => 'Failed to fetch KML from external source'], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to fetch KML: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}

