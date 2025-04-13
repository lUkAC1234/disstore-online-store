import styles from "./EditFieldModal.module.scss";
import { PureComponent, FormEvent } from "react";
import ControlledPhoneInput from "components/UI/Phone/ControlledPhoneInput";
import { ActionButton, HeadingFour, Input } from "components/UI/Html/Elements/Elements";

interface EditFieldModalProps {
  field: string; 
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
}

class EditFieldModal extends PureComponent<EditFieldModalProps> {
  render() {
    const { field, label, value, onChange, onCancel, onSubmit } = this.props;
    return (
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal"]}>
          <HeadingFour className={styles["change-subtitle"]}>Изменить {label}</HeadingFour>
          <form onSubmit={onSubmit}>
            {field === "mobile_number" ? (
              <ControlledPhoneInput
                value={value}
                onChange={(formatted, _) => onChange(formatted)}
                placeholder="+998 (__) ___ __ __"
              />
            ) : (
              <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
            <div className={styles["modal-buttons"]}>
              <ActionButton white type="button" onClick={onCancel}>
                Отмена
              </ActionButton>
              <ActionButton type="submit">Сохранить</ActionButton>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditFieldModal;
