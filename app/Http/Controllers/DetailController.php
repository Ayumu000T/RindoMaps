<?php

namespace App\Http\Controllers;

use App\Models\KMLData;
use Illuminate\Http\Request;

class DetailController extends Controller
{
    public function detail($id) {
        $spots = KMLData::findOrFail($id);
        return view('detail', compact('spots'));
    }
}
