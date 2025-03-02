declare global {
    interface ColorsData {
        colors: Color[];
    }

    interface SelectedOptionsColor {
        color: string;
    }

    interface ColorSelectorProps {
        data: ColorsData;
        selectedOptions: SelectedOptionsColor;
        handleOptionChange: (option: string, value: string) => void;
    }
    interface ColorSelectorState { }
}

export { }