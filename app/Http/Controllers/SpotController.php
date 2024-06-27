<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use App\Models\Spot;
use App\Models\KMLData;
use App\Helpers\DifficultyHelper;

class SpotController extends Controller
{
    public function index()
    {
        // 全ての難易度を取得
        // $allDifficulties = Spot::groupBy('difficulty')
        //     ->selectRaw('MIN(id) as id, difficulty')
        //     ->orderBy('difficulty', 'asc')
        //     ->get();

        // $spots = Spot::all();

        // return view('index', [
        //     'spots' => $spots,
        //     'allDifficulties' => $allDifficulties
        // ]);

        //テーブル以降後
        $allDifficulties = KMLData::groupBy('difficulty')
            ->selectRaw('MIN(id) as id, difficulty')
            ->orderBy('difficulty', 'asc')
            ->get();

        $spots = KMLData::all();

        return view('index', [
            'spots' => $spots,
            'allDifficulties' => $allDifficulties
        ]);
    }

    public function handleFormApi(Request $request)
    {
        // $difficulty = $request->input('difficulty');

        // if ($difficulty === 'selectAllRindo') {
        //     $spots = Spot::all();

        //     return response()->json([
        //         'spots' => $spots,
        //         'selectedDifficulty' => '全ての林道',
        //     ]);

        // } else {
        //     $spots = Spot::where('difficulty', $difficulty)->get();

        //     return response()->json([
        //         'spots' => $spots,
        //         'selectedDifficulty' => $difficulty,
        //     ]);
        // }

        //テーブル以降後
        $difficulty = $request->input('difficulty');

        if ($difficulty === 'selectAllRindo') {
            $spots = KMLData::all();

            return response()->json([
                'spots' => $spots,
                'selectedDifficulty' => '全ての林道',
            ]);

        } else {
            $spots = KMLData::where('difficulty', $difficulty)->get();

            return response()->json([
                'spots' => $spots,
                'selectedDifficulty' => $difficulty,
            ]);
        }
    }

}
