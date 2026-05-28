// (K) ALL RIGHTS REVERSED - Reprint what you like

/**
 * Information about a link.
 */
export class StatusLink {
    description: string;
    imageUrl: string | undefined;
    title: string;
    url: string;

    constructor(url: string, title: string, description: string, imageUrl: string | null | undefined) {
        this.description = description;
        this.imageUrl = imageUrl ?? undefined;
        this.title = title;
        this.url = url;
    }
}
