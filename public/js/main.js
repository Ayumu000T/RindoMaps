'use script';

{
    //selectに難易度の難易度を星に変換
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
            case '5':
                return '★★★★★';
            case '全ての林道':
                return difficulty;
            default:
                return '';
        }
    }

    //クリックで説明文の表示と▲の向き変更
    function appearDescription() {
        const spotNames = document.querySelectorAll('.spot_name');
        spotNames.forEach(spotName => {
            spotName.addEventListener('click', () => {
                const description = spotName.nextElementSibling;
                if (description && description.classList.contains('spot_description')) {
                    description.classList.toggle('appear');

                    const spanIcon = spotName.querySelector('.spot_name_icon');
                    if (spanIcon) {
                        if (spanIcon.textContent === '▲') {
                            spanIcon.textContent = '▼';
                        } else {
                            spanIcon.textContent = '▲';
                        }
                    }
                }
            });
        });
    }




    //選択した難易度と一覧を表示
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
                        const dt = document.createElement('dt');
                        dt.innerHTML = `<span class="spot_name_icon">▼</span>${spot.name}`;
                        dt.classList.add('spot_name');
                        resultList.appendChild(dt);

                        const dd = document.createElement('dd');
                        dd.textContent = `Info: ${spot.description}`;
                        dd.classList.add('spot_description');
                        resultList.appendChild(dd);


                    });

                    appearDescription();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        }
        appearDescription();
    });


}
