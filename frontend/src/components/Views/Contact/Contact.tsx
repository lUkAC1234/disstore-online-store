import { PureComponent, ReactNode } from "react";
import styles from "./Contact.module.scss";

class Contact extends PureComponent<ContactProps, ContactState> {
  render(): ReactNode {
    return (
      <div className={styles["container"]}>
        Contact component
      </div>
    );
  }
}

export default Contact;