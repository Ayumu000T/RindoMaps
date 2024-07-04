{{-- 
<x-layout>
    <h1>{{ $spots->name }}</h1>
    <p>{{ $spots->description }}</p>
    @if (file_exists(public_path('storage/img/info_img_' . $spots->name . '.jpg')))
        <img src="{{ asset('storage/img/info_img_' . $spots->name . '.jpg') }}" alt="Spot Image">
    @else
        <img src="{{ asset('storage/img/info_img_non.jpg') }}" alt="Alternative Image">
    @endif
</x-layout> --}}