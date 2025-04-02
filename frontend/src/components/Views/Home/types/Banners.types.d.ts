declare global {
    interface IBanner {
        id: number;
        file: string;
        thumbnail: string | null;
        types: Clothestypes[];
    }

    interface IBannersState {
        banners: IBanner[];
        error: string | null;
        progress: number;
        isUserInteracting: boolean;
    }
}

export { }