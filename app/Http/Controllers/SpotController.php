<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Spot;
use App\Helpers\DifficultyHelper;

class SpotController extends Controller
{
    public function index()
    {
        // 全ての難易度を取得
        $allDifficulties = Spot::groupBy('difficulty')
            ->selectRaw('MIN(id) as id, difficulty')
            ->orderBy('difficulty', 'asc')
            ->get();

        return view('index', [
            // 'spots' => [],
            'selectedDifficulty' => null,
            'allDifficulties' => $allDifficulties
        ]);
    }

    public function handleFormApi(Request $request)
    {
        $difficulty = $request->input('difficulty');

        if ($difficulty === 'selectAllDifficulties') {
            $spots = Spot::all();
            // $spots = Spot::orderBy('difficulty', 'asc')->get();

            return response()->json([
                'spots' => $spots,
                'selectedDifficulty' => '全ての林道',
            ]);

        } else {
            $spots = Spot::where('difficulty', $difficulty)->get();

            return response()->json([
                'spots' => $spots,
                'selectedDifficulty' => $difficulty,
            ]);
        }
    }

}
