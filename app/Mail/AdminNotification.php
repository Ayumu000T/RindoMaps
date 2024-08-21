<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    
     /**
     * 新しいメッセージインスタンスを作成。
     *
     * @param array $data メールに含めるデータ
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     *  通知メールのタイトル設定
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '林道マップに新しい問い合わせがありました',
        );
    }

    /**
     *  問い合わせ内容の設定
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin_notification', // views/emails/admin_notificationに設定したHTMLの内容
            with: ['data' => $this->data], // HTML内で使うデータ
        );
    }
}
