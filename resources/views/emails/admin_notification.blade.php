{{-- 問い合わせがあった際に管理者に通知メールを送る --}}
<!DOCTYPE html>
<html>
<head>
    <title>新しい問い合わせがありました</title>
    <style>
        .custom-h1 {
            font-size: 16px;
            font-weight: normal;
        }
    </style>
</head>
<body>
    <h1 class="custom-h1">新しいお問い合わせがありました</h1>
    <p>----------------------------------------------------------------------</p>
    <p><strong>お名前:</strong> {{ $data['name'] }}</p>
    <p><strong>メールアドレス:</strong> {{ $data['email'] }}</p>
    <p><strong>内容:</strong></p>
    <p>{{ $data['message'] }}</p>
    <p>----------------------------------------------------------------------</p>
    <p>問い合わせ内容をご確認ください。</p>
    <p>林道マップ</p>
    <p class="url">⇒<a href="#">httt/atatatatatat</a></p>
</body>
</html>
