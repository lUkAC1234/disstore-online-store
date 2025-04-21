import styles from "./Profile.module.scss";
import { PureComponent, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { withTranslation } from "i18n/hooks";
import { UserContext } from "components/Context/ContextCollection";
import { withContextSelector } from "components/Context/ContextInjector";
import { Container, Section, Sidebar } from "components/UI/Html/Elements/Elements";
import UserProfile from "./UserProfile/UserProfile";
import Orders from "./Orders/Orders";

class Profile extends PureComponent<ProfileProps, ProfileState> {
  readonly state: Readonly<ProfileState> = {
    first_name: this.props.user?.first_name || "",
    last_name: this.props.user?.last_name || "",
    mobile_number: this.props.user?.mobile_number || "",
    activeTab: "orders",
  };

  get lang(): string {
    return this.props.i18n.language;
  }

  componentDidUpdate(prevProps: ProfileProps) {
    if (prevProps.user !== this.props.user && this.props.user) {
      const { first_name, last_name, mobile_number } = this.props.user;
      this.setState({ first_name, last_name, mobile_number });
    }
  }

  handleTabChange = (tab: "orders" | "profile") => {
    this.setState({ activeTab: tab });
  };

  render(): ReactNode {
    const { isAuthenticated, user, setLogout } = this.props;

    if (!isAuthenticated || !user) {
      return <Navigate to={`/${this.lang}/authentication`} />;
    }

    const { first_name, last_name, activeTab } = this.state;

    return (
      <Section>
        <Container className={styles["profile-container"]}>
          <div className={styles["profile-head-container"]}>
            <h1>{first_name} {last_name}</h1>
          </div>

          <div className={styles["profile-wrapper"]}>
            <Sidebar className={styles["profile-sidebar"]}>
              <ul className={styles["profile-sidebar-wrapper"]}>
                <li
                  className={`${styles["profile-sidebar-list"]} ${activeTab === "orders" ? styles["active"] : ""}`}
                  onClick={() => this.handleTabChange("orders")}
                >
                  Заказы
                </li>
                <li
                  className={`${styles["profile-sidebar-list"]} ${activeTab === "profile" ? styles["active"] : ""}`}
                  onClick={() => this.handleTabChange("profile")}
                >
                  Профиль
                </li>
              </ul>
            </Sidebar>

            <div className={styles["profile-content"]}>
              {activeTab === "orders" ? <Orders /> : <UserProfile user={user} />}
            </div>
          </div>

          <div className={styles["profile-logout-container"]}>
            <button onClick={setLogout}>Выйти</button>
          </div>
        </Container>
      </Section>
    );
  }
}

const UIProfile = withContextSelector(UserContext, Profile, (context) => ({
  isAuthenticated: context.isAuthenticated,
  user: context.user,
  setLogout: context.setLogout,
}));

export default withTranslation(UIProfile);
