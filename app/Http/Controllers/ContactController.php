<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inquiry;
use App\Models\InquiryMessage;
use Illuminate\Support\Facades\Mail;

/**
 * 問い合わせページの処理
 */
class ContactController extends Controller
{
    /**
     * ページ表示
     */
    public function showForm()
    {
        return view('contact');
    }

    /**
     * 問い合わせフォームにデータ処理
     */
    public function submitFrom(Request $request)
    {
        // バリデーションルール
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $inquiry = Inquiry::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
        ]);

        InquiryMessage::create([
            'inquiry_id' => $inquiry->id,
            'message' => $validatedData['message'],
        ]);

        // フォーム送信後、同じページにリダイレクトしつつ、送信完了のモーダルウィンドを表示するフラグを渡す
        return redirect()->route('contact')->with('status', 'success');
    }
}
