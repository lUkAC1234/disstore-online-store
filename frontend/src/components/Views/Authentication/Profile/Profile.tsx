import { PureComponent, ReactNode } from "react";
import styles from "./Profile.module.scss";
import { UserContext } from "components/Context/ContextCollection";
import { withContextSelector } from "components/Context/ContextInjector";
import { getWithTranslation } from "i18n/hooks";
import { Navigate } from "react-router-dom";

class Profile extends PureComponent<ProfileProps, ProfileState> {
  get lang(): string {
    return this.props.i18n.language;
  }

  render(): ReactNode {
    if (!this.props.isAuthenticated) {
      return <Navigate to={`/${this.lang}/authentication`} />;
    }
    return (
      <div className={styles["container"]}>
        <h2>Вы уже авторизованы</h2>
        <p>{this.props.user?.email}</p>
        <p>{this.props.user?.first_name}</p>
        <p>{this.props.user?.last_name}</p>
        <p>{this.props.user?.mobile_number}</p>
        <button onClick={this.props.setLogout}>Выйти</button>
      </div>
    );
  }
}

const UIProfile = withContextSelector(UserContext, Profile, (context) => ({
  isAuthenticated: context.isAuthenticated,
  user: context.user,
  setLogout: context.setLogout,
}));

const TranslatedUIProfile = getWithTranslation(UIProfile);

export default TranslatedUIProfile;
;