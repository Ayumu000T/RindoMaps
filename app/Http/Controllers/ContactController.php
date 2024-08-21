<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inquiry;
use App\Models\InquiryMessage;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactConfirmation;
use App\Mail\AdminNotification;

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
            'name' => 'required|string|max:255', // 名前
            'email' => 'required|email|max:255', // メールアドレス
            'message' => 'required|string|max:2000', //メール内容
            'sendConfirmationEmail' => 'nullable|boolean', //確認メールのチェックボックス
        ]);

        // inquiriesテーブルに保存する
        $inquiry = Inquiry::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
        ]);

        // inquiry_messagesに保存する
        InquiryMessage::create([
            'inquiry_id' => $inquiry->id,
            'message' => $validatedData['message'],
        ]);

        // チェックボックスがオンの場合に確認メールを送信
        if ($request->filled('sendConfirmationEmail')) {
            Mail::to($validatedData['email'])->send(new ContactConfirmation($validatedData));
        }

        // 管理者に通知メールを送信
        Mail::to('admin@example.com')->send(new AdminNotification($validatedData));

        // フォーム送信後、同じページにリダイレクトしつつ、送信完了のモーダルウィンドを表示するフラグを渡す
        return redirect()->route('contact')->with('status', 'success');
    }
}

