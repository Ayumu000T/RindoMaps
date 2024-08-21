{{-- ユーザーへ送る問い合わせ内容の確認メールの内容 --}}
<!DOCTYPE html>
<html>
<head>
    <title>お問い合わせありがとうございます</title>
    <style>
        .custom-h1 {
            font-size: 16px;
            font-weight: normal;
        }
    </style>
</head>
<body>
    <h1 class="custom-h1">お問い合わせありがとうございます。</h1>
    <p>以下の内容でメッセージを受け取りました。</p>
    <p>----------------------------------------------------------------------</p>
    <p><strong>お名前:</strong> {{ $data['name'] }}</p>
    <p><strong>メールアドレス:</strong> {{ $data['email'] }}</p>
    <p><strong>内容:</strong></p>
    <p>{{ $data['message'] }}</p>
    <p>----------------------------------------------------------------------</p>
    <p>返信までしばらくお待ちください。</p>
    <p>林道マップ</p>
    <p class="url">⇒<a href="#">httt/atatatatatat</a></p>
</body>
</html>
