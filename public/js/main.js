'use script';

{

    //同期処理時にphpに定義したものを流用
    function convertDifficultyToStar(difficulty) {
        switch (difficulty) {
            case '1':
                return '★';
            case '2':
                return '★★';
            case '3':
                return '★★★';
            case '4':
                return '★★★★';
            case '全ての林道':
                return difficulty;
            default:
                return '';
        }
    }


    document.addEventListener('DOMContentLoaded', function () {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const difficultySelect = document.getElementById('difficulty_select');

        if (difficultySelect) {
            difficultySelect.addEventListener('change', function (event) {
                event.preventDefault();


                const difficulty = difficultySelect.value;

                //フォームデータ作成
                const formData = new FormData();
                formData.append('difficulty', difficulty);

                //fetch送信
                fetch('/handle-form-api', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    //難易度の表示
                    const resultDifficulty = document.getElementById('result_difficulty');
                    resultDifficulty.textContent = `選択中の難易度: ${convertDifficultyToStar(data.selectedDifficulty)}`;

                    //↑の林道一覧
                    const resultList = document.getElementById('result_list');
                    resultList.innerHTML = '';
                    data.spots.forEach(spot => {

                        const li = document.createElement('li');
                        li.textContent = spot.name;
                        resultList.appendChild(li);
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        }
    });

}

//やること
//全ての林道を選択し時の条件分岐を作れる
