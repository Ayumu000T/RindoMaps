<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * ContactControllerから引数で渡された$validatedData
     */
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
     *  確認メールのタイトルを設定
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'お問い合わせありがとうございます',
        );
    }

    /**
     *  確認メールの内容を設定
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact_confirmation', // views/emails/contact_confirmationに設定したHTMLの内容
            with: ['data' => $this->data], // HTML内で使うデータ
        );
    }

}
