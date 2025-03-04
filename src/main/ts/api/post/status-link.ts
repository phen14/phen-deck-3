export class StatusLink {
    description: string;
    imageUrl: string | null | undefined;
    title: string;
    url: string;

    constructor(url: string, title: string, description: string, imageUrl: string | null | undefined) {
        this.description = description;
        this.imageUrl = imageUrl;
        this.title = title;
        this.url = url;
    }
}
