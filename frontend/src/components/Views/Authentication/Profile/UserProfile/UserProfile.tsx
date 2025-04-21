import styles from "./UserProfile.module.scss";
import { PureComponent, ChangeEvent, ReactNode } from "react";
import { Input, Label, ActionButton } from "components/UI/Html/Elements/Elements";
import { UserData } from "components/Context/UserContext";
import { withContextSelector } from "components/Context/ContextInjector";
import { UserContext } from "components/Context/ContextCollection";
import ControlledPhoneInput from "components/UI/Phone/ControlledPhoneInput";

interface UserProfileProps {
    user: UserData;
    updateUser: (data: Partial<UserData>) => Promise<void>;
}

interface UserProfileState {
    editedData: Partial<UserData>;
    isModified: boolean;
    isSaving: boolean;
}

class UserProfile extends PureComponent<UserProfileProps, UserProfileState> {
    state: Readonly<UserProfileState> = {
        editedData: {},
        isModified: false,
        isSaving: false,
    };

    updateField = (name: keyof UserData, value: string) => {
        this.setState((prevState) => {
            const newEdited = { ...prevState.editedData, [name]: value };
            const isModified = Object.keys(newEdited).some((key) => {
                const field = key as keyof UserData;
                return newEdited[field] !== this.props.user[field];
            });

            return { editedData: newEdited, isModified };
        });
    };

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.updateField(e.target.name as keyof UserData, e.target.value);
    };

    handleCancel = () => {
        this.setState({ editedData: {}, isModified: false });
    };

    handleSave = async () => {
        this.setState({ isSaving: true });
        const { editedData } = this.state;
        const updatedFields = Object.entries(editedData).reduce((acc, [key, value]) => {
            const field = key as keyof UserData;
            if (value !== this.props.user[field]) {
                acc[field] = value as never;
            }
            return acc;
        }, {} as Partial<UserData>);

        try {
            if (Object.keys(updatedFields).length > 0) {
                await this.props.updateUser(updatedFields);
            }
        } catch (error) {
            console.error("Ошибка при сохранении данных", error);
        } finally {
            this.setState({ isSaving: false, isModified: false });
        }
    };

    renderField(label: string, name: keyof UserData) {
        const value = this.state.editedData[name] ?? this.props.user[name] ?? "";

        return (
            <div className={styles["profile-form-group"]}>
                <Label htmlFor={name}>{label}</Label>
                <div className={styles["profile-field-container"]}>
                    {name === "mobile_number" ? (
                        <ControlledPhoneInput
                            value={String(value)}
                            onChange={(val) => this.updateField(name, val)}
                        />
                    ) : (
                        <Input
                            id={name}
                            name={name}
                            value={value}
                            onChange={this.handleChange}
                            className={styles["profile-field"]}
                        />
                    )}
                </div>
            </div>
        );
    }

    render(): ReactNode {
        const { user } = this.props;
        const { isModified, isSaving } = this.state;

        return (
            <div className={styles["user-info-container"]}>
                <div className={styles["user-info-fields-container"]}>
                    <Label htmlFor="email">Почта</Label>
                    <Input className={styles["profile-field"]} id="email" value={user.email} disabled />
                </div>

                <div className={styles["profile-info-container"]}>
                    {this.renderField("Имя", "first_name")}
                    {this.renderField("Фамилия", "last_name")}
                    {this.renderField("Телефон", "mobile_number")}
                </div>

                {isModified && (
                    <div className={styles["profile-save-actions"]}>
                        <ActionButton white onClick={this.handleCancel} disabled={isSaving}>
                            Отменить
                        </ActionButton>
                        <ActionButton onClick={this.handleSave} disabled={isSaving}>
                            {isSaving ? "Сохранение..." : "Сохранить"}
                        </ActionButton>
                    </div>
                )}
            </div>
        );
    }
}

const UIUserProfile = withContextSelector(UserContext, UserProfile, (context) => ({
    updateUser: context.updateUser,
}));

export default UIUserProfile;
