declare global {
    interface SizesData {
        sizes: Size[];
    }

    interface SelectedOptionsSize {
        size: string;
    }

    interface SizeSelectorProps {
        data: SizesData;
        selectedOptions: SelectedOptionsSize;
        handleOptionChange: (option: string, value: string) => void;
    }
    interface SizeSelectorState { }
}

export { }