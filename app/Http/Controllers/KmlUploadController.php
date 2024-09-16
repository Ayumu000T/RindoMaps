<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KmlUploadController extends Controller
{
    public function upload(Request $request)
    {
        // バリデーション
        $request->validate([
            'kmlFile' => 'required|file|mimes:kml|max:2048', // 2MBまで
        ]);

        if ($request->hasFile('kmlFile')) {
            $file = $request->file('kmlFile');

            // ファイルの保存
            $fileName = 'filteredData_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('uploads', $fileName, 'public');

            // ファイルのURLを生成
            $fileUrl = Storage::url($path);

            return response()->json(['fileUrl' => $fileUrl]);
        }

        return response()->json(['message' => 'No file received'], 400);
    }
}
