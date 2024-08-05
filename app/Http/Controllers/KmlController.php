<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class KmlController extends Controller
{
    public function getKmlUrls()
    {
        // 例として、KMLファイルのURLを返す
        return response()->json([
            'difficulty1' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7ynBOV8jQUo',
            'difficulty2' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=FHEwq7ut1X8',
            'difficulty3' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=rd6pvMc1c1c',
            'difficulty4' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7SU8cepGjbg',
            'difficulty5' => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=2_crKVxfQWY',
        ]);
    }
}

// public function proxyKml(Request $request, $difficulty)
    // {
    //     $kmlUrls = [
    //         1 => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7ynBOV8jQUo',
    //         2 => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=FHEwq7ut1X8',
    //         3 => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=rd6pvMc1c1c',
    //         4 => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7SU8cepGjbg',
    //         5 => 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=2_crKVxfQWY',
    //     ];

    //     // $kmlUrlsの配列内にKey（$difficulty）があるか確認
    //     if (!array_key_exists($difficulty, $kmlUrls)) {
    //         return response()->json(['error' => 'Invalid difficulty'], 400);
    //     }

    //     //指定された難易度のkmlファイルのURLを$kmlUrls内から取得
    //     $kmlUrl = $kmlUrls[$difficulty];

    //     return response()->json(['url' => $kmlUrl], 200);
    // }
//kmlの内容を返すコード
        // try {
        //     // 外部のKMLファイルを取得
        //     $response = Http::get($kmlUrl);

        //     // 取得が成功した場合、KMLファイルの内容を返す
        //     if ($response->successful()) {
        //         return response($response->body(), 200)
        //             ->header('Content-Type', 'application/vnd.google-earth.kml+xml');//kmlファイル
        //     } else {
        //          \Log::error('Failed to fetch KML from external source: ' . $response->status());
        //         return response()->json(['error' => 'Failed to fetch KML from external source'], 500);
        //     }
        // } catch (\Exception $e) {
        //     // 例外が発生した場合、エラーログを記録し、エラーメッセージを返す
        //     \Log::error('Failed to fetch KML: ' . $e->getMessage());
        //     return response()->json(['error' => 'Internal server error'], 500);
        // }
