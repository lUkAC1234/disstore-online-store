import { PureComponent, createRef, HTMLAttributes, createElement, ElementType, ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from "react";
import { LinkProps } from "react-router-dom";
import styles from "./Elements.module.scss";
import LangLink from "components/UI/Link/LangLink";
interface ElementProps extends HTMLAttributes<HTMLElement> { 
  white?: boolean; 
  bold?: boolean; 
  regular?: boolean;
  centerGrid?: boolean; 
  centerFlex?: boolean; 
}
interface CustomLinkProps extends Omit<ElementProps, keyof LinkProps>, LinkProps {}
abstract class BaseElement<P extends ElementProps = ElementProps> extends PureComponent<P> {
  elementRef = createRef<HTMLElement>();
  abstract tag: ElementType;
  abstract customName: string;
  componentDidMount() { this.elementRef.current?.setAttribute("is", this.customName); }

  render() {
    const { children, className, white, bold, regular, centerGrid, centerFlex, ...rest } = this.props;
    const combinedClassName = `${styles[this.customName]} ${className || ""} ${white ? styles.white : ""} ${bold ? styles.bold : ""} ${regular ? styles.regular : ""} ${centerGrid ? styles.centerGrid : ""}  ${centerFlex ? styles.centerFlex : ""}`.trim();

    return createElement(
      this.tag,
      { ...rest, ref: this.elementRef, className: combinedClassName },
      children
    );
  }
}

// Headings

export class HeadingOne extends BaseElement {
  tag: ElementType = "h1";
  customName = "headingOne";
}

export class HeadingTwo extends BaseElement {
  tag: ElementType = "h2";
  customName = "headingTwo";
}

export class HeadingThree extends BaseElement {
  tag: ElementType = "h3";
  customName = "headingThree";
}

export class HeadingFour extends BaseElement {
  tag: ElementType = "h4";
  customName = "headingFour";
}

export class HeadingFive extends BaseElement {
  tag: ElementType = "h5";
  customName = "headingFive";
}

export class HeadingSix extends BaseElement {
  tag: ElementType = "h6";
  customName = "headingSix";
}

// Containers

export class Container extends BaseElement {
  tag: ElementType = "div";
  customName = "container";
}

export class LGContainer extends BaseElement {
  tag: ElementType = "div";
  customName = "lg-container";
}

export class MDContainer extends BaseElement {
  tag: ElementType = "div";
  customName = "md-container";
}

export class Section extends BaseElement {
  tag: ElementType = "section";
  customName = "section";
}

export class Article extends BaseElement {
  tag: ElementType = "article";
  customName = "article";
}

export class Sidebar extends BaseElement {
  tag: ElementType = "aside";
  customName = "sidebar";
}

// Text Elements

export class Text extends BaseElement {
  tag: ElementType = "p";
  customName = "text";
}

export class SmallText extends BaseElement {
  tag: ElementType = "p";
  customName = "smallText";
}

export class CustomLink extends BaseElement<CustomLinkProps> {
  tag: ElementType = LangLink;
  customName = "link";
}

export class Bold extends BaseElement {
  tag: ElementType = "strong";
  customName = "bold";
}

export class ListItem extends BaseElement {
  tag: ElementType = "li";
  customName = "listItem";
}

export class List extends BaseElement {
  tag: ElementType = "ul";
  customName = "list";
}

export class InlineText extends BaseElement {
  tag: ElementType = "span";
  customName = "inlineText";
}

export class BlockQuote extends BaseElement {
  tag: ElementType = "blockquote";
  customName = "blockQuote";
}

export class Preformatted extends BaseElement {
  tag: ElementType = "pre";
  customName = "preformatted";
}

// Buttons

export class ActionButton extends BaseElement<ElementProps & ButtonHTMLAttributes<HTMLButtonElement>>  {
  tag: ElementType = "button";
  customName = "actionButton";
}

export class ActionButtonLink extends BaseElement<CustomLinkProps & ButtonHTMLAttributes<HTMLButtonElement>> {
  tag: ElementType = LangLink;
  customName = "actionButton";
}

// Inputs
export class Input extends BaseElement<ElementProps &  InputHTMLAttributes<HTMLInputElement>> {
  tag: ElementType = "input";
  customName = "customInput";
}

export class Label extends BaseElement<ElementProps &  LabelHTMLAttributes<HTMLLabelElement>> {
  tag: ElementType = "label";
  customName = "customLabel";
}

// Other Elements

export class Small extends BaseElement {
  tag: ElementType = "small";
  customName = "small";
}

export class Mark extends BaseElement {
  tag: ElementType = "mark";
  customName = "mark";
}

export class Del extends BaseElement {
  tag: ElementType = "del";
  customName = "del";
}

export class Ins extends BaseElement {
  tag: ElementType = "ins";
  customName = "ins";
}

export class Abbr extends BaseElement {
  tag: ElementType = "abbr";
  customName = "abbr";
}

export class Address extends BaseElement {
  tag: ElementType = "address";
  customName = "address";
}

export class Time extends BaseElement {
  tag: ElementType = "time";
  customName = "time";
}

export class Kbd extends BaseElement {
  tag: ElementType = "kbd";
  customName = "kbd";
}

export class Code extends BaseElement {
  tag: ElementType = "code";
  customName = "code";
}
