import MapManager from './_MapManager.js';


export class FocusMaker {
    constructor() {
        this.mapManager = new MapManager();
    }

    inut() {
        document.querySelectorAll('.spot_name').forEach(spotName => {
            spotName.addEventListener('click', () => {
                const coordinates = spotName.dataset.coordinates.split(',');
                const lat = parseFloat(coordinates[1]);
                const lng = parseFloat(coordinates[0]);
                const position = { lat: lat, lng: lng };
                const name = spotName.textContent.trim();
                const description = spotName.dataset.description.trim();
                let imageSrc = `img/info_img_${name}.jpg`;


                
            });
        });
    }
}











class FocusMaker {
    constructor() {
        this.mapManager = new MapManager();
    }

    init() {
        document.querySelectorAll('.spot_name').forEach(spotName => {
            spotName.addEventListener('click', () => {
                const coordinates = spotName.dataset.coordinates.split(',');
                const lat = parseFloat(coordinates[1]);
                const lng = parseFloat(coordinates[0]);
                const position = { lat: lat, lng: lng };
                const name = spotName.textContent.trim();
                const description = spotName.dataset.description.trim();
                let imageSrc = `img/info_img_${name}.jpg`;

                this.mapManager.imageExistsAsync(imageSrc, exists => {
                    if (!exists) {
                        imageSrc = 'img/info_img_non.jpg';
                    }

                    const content = `
                        <h2>${name}</h2>
                        <p>${description}</p>
                        <p>詳細</p>
                        <img src="${imageSrc}" width="300">
                    `;

                    this.mapManager.handleInfoWindow(content, position, name);
                });
            });
        });
    }
}

