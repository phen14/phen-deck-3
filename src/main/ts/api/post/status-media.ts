export class StatusMedia {
    url: string;

    height: number;
    width: number;

    constructor(url: string, height: number = 0, width: number = 0) {
        this.url = url;
        this.height = height;
        this.width = width;
    }
}
