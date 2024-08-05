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

    public function fetchKml(Request $request)
    {
        $kmlUrl = $request->query('kmlUrl');

        if (!$kmlUrl) {
            return response()->json(['error' => 'No KML URL provided'], 400);
        }

        try {
            // 外部のKMLファイルを取得
            $response = Http::get($kmlUrl);

            if ($response->successful()) {
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