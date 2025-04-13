import styles from "./Profile.module.scss";
import { FormEvent, PureComponent, ReactNode } from "react";
import { UserContext } from "components/Context/ContextCollection";
import { withContextSelector } from "components/Context/ContextInjector";
import { withTranslation } from "i18n/hooks";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import EditFieldModal from "./EditFieldModal/EditFieldModal";
import { Container, HeadingOne, Input, Label, Section, Sidebar } from "components/UI/Html/Elements/Elements";

const fieldLabels: { [key in keyof EditableProfileFields]: string } = {
  first_name: "Имя",
  last_name: "Фамилия",
  mobile_number: "Телефон",
};

class Profile extends PureComponent<ProfileProps, ProfileState> {
  static editableFields: (keyof EditableProfileFields)[] = ["first_name", "last_name", "mobile_number"];

  state: Readonly<ProfileState> = {
    first_name: this.props.user?.first_name || "",
    last_name: this.props.user?.last_name || "",
    mobile_number: this.props.user?.mobile_number || "",
    modalField: null,
    modalValue: "",
  };

  get lang(): string {
    return this.props.i18n.language;
  }

  componentDidUpdate(prevProps: ProfileProps) {
    if (prevProps.user !== this.props.user) {
      this.setState({
        first_name: this.props.user?.first_name || "",
        last_name: this.props.user?.last_name || "",
        mobile_number: this.props.user?.mobile_number || "",
      });
    }
  }

  openModal = (field: keyof EditableProfileFields) => {
    this.setState({
      modalField: field,
      modalValue: this.props.user ? this.props.user[field] : "",
    });
  };

  handleModalCancel = () => {
    this.setState({ modalField: null, modalValue: "" });
  };

  handleModalChange = (newValue: string) => {
    this.setState({ modalValue: newValue });
  };

  handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { modalField, modalValue } = this.state;
    if (!modalField) return;

    if (this.props.user[modalField] !== modalValue) {
      try {
        await this.props.updateUser({ [modalField]: modalValue });
      } catch (error) {
        console.error("Update failed", error);
      }
    }
    this.setState({ modalField: null, modalValue: "" });
  };

  render(): ReactNode {
    if (!this.props.isAuthenticated) {
      return <Navigate to={`/${this.lang}/authentication`} />;
    }
    return (
      <Section>
        <Container className={styles["profile-container"]}>
          <div className={styles["profile-head-container"]}>
            <HeadingOne>Профиль</HeadingOne>
          </div>

          <div className={styles["profile-wrapper"]}>
            <Sidebar className={styles["profile-sidebar"]}>
              <div className={styles["profile-sidebar-item"]}>
                <Link to="">Личный кабинет</Link>
              </div>
              <div className={styles["profile-sidebar-item"]}>
                <Link to="">История заказов</Link>
              </div>
            </Sidebar>
            <div className={styles["profile-main-container"]}>
              <div className={styles["profile-main-fields-container"]}>
                <Label htmlFor="email">Почта</Label>
                <Input className={styles["profile-field"]} id="email" value={this.props.user?.email} disabled />
              </div>

              <div className={styles["profile-info-container"]}>
                <div className={styles["profile-form-group"]}>
                  <Label htmlFor="first_name">Имя</Label>
                  <div className={styles["profile-field-container"]}>
                    <Input className={styles["profile-field"]} id="first_name" value={this.props.user?.first_name} disabled />
                    <button className={styles["edit-btn"]} onClick={() => this.openModal("first_name")}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                </div>
                <div className={styles["profile-form-group"]}>
                  <Label htmlFor="last_name">Фамилия</Label>
                  <div className={styles["profile-field-container"]}>
                    <Input className={styles["profile-field"]} id="email" value={this.props.user?.last_name} disabled />
                    <button className={styles["edit-btn"]} onClick={() => this.openModal("last_name")}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                </div>
                <div className={styles["profile-form-group"]}>
                  <Label htmlFor="mobile_number">Телефон</Label>
                  <div className={styles["profile-field-container"]}>
                    <Input className={styles["profile-field"]} id="email" value={this.props.user?.mobile_number} disabled />
                    <button className={styles["edit-btn"]} onClick={() => this.openModal("mobile_number")}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles["profile-logout-container"]}>
            <button onClick={this.props.setLogout}>Выйти</button>
          </div>

          {this.state.modalField && (
            <EditFieldModal
              field={this.state.modalField}
              label={fieldLabels[this.state.modalField]}
              value={this.state.modalValue}
              onChange={this.handleModalChange}
              onCancel={this.handleModalCancel}
              onSubmit={this.handleModalSubmit}
            />
          )}
        </Container>
      </Section>
    );
  }
}

const UIProfile = withContextSelector(UserContext, Profile, (context) => ({
  isAuthenticated: context.isAuthenticated,
  user: context.user,
  setLogout: context.setLogout,
  updateUser: context.updateUser,
}));

const TranslatedUIProfile = withTranslation(UIProfile);

export default TranslatedUIProfile;
