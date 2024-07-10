<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>林道マップ</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/js/main.js', 'resources/css/styles.css'])
</head>
<body>
    {{ $slot }}
</body>
</html>
