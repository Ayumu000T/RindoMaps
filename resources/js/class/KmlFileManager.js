//KMLファイルの読み込み
export class KmlFileManager {
    constructor() {
        this.kmlLayerURLS = {
            difficulty1: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7ynBOV8jQUo',
            difficulty2: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=FHEwq7ut1X8',
            difficulty3: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=rd6pvMc1c1c',
            difficulty4: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7SU8cepGjbg',
            difficulty5: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=2_crKVxfQWY',
        };
        this.difficultyURLS = this.createDifficultyURLS();
    }

    createDifficultyURLS() {
        const urls = {};
        Object.keys(this.kmlLayerURLS).forEach(key => {
            const difficulty = key.replace('difficulty', '');
            urls[difficulty] = this.kmlLayerURLS[key];
        });
        return urls;
    }

    getURL(difficulty) {
        return this.difficultyURLS[difficulty];
    }
}
