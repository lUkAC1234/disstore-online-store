import "./TransformTransition.scss";
import { createRef, KeyboardEvent, MouseEvent, ReactNode, RefObject } from "react";
import { debounce } from "utils/hooks/debounce";
import { TRANSFORM_TRANSITION_STATE } from "./TransformTransition.constants";
import Transition from "components/Animations/Transition/Transition";
import ResizeObserverAPI from "utils/classes/ResizeObserverAPI";
import UIReact from "utils/classes/UIReact";

class TransformTransition extends UIReact<TransformTransitionProps, TransformTransitionState> {
  transformTransitionNavRef: RefObject<HTMLUListElement> = createRef<HTMLUListElement>();
  transformTransitionContentRef: RefObject<HTMLElement> = createRef<HTMLElement>();
  followerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  transformContainerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  transformTransitionNavBtnNodeList: NodeListOf<HTMLButtonElement>;
  transformTransitionContentNodeList: NodeListOf<HTMLDivElement>;
  resizeObserver: ResizeObserver;

  state: Readonly<TransformTransitionState> = {
    ...TRANSFORM_TRANSITION_STATE,
  };

  get fullwidthClassName(): string {
    return (this.props.fullwidth)
      ? `transform-transition__nav transform-transition__nav--full-width`
      : "transform-transition__nav";
  }

  get content(): ReactNode {
    return this.props?.list?.map((item: TransformTransitionData, index: number) =>
      <div
        key={index}
        className="transform-transition__content__item"
        style={{
          minWidth: this.transformTransitionContentRef?.current?.offsetWidth,
        }}
      >
        {item.content}
      </div>
    );
  }

  get headerNavigation(): ReactNode {
    return this.props?.list?.map((item: TransformTransitionData, index: number) =>
      <li key={index}>
        <button
          type="button"
          current-item={index}
          className="transform-transition__nav__btn"
          onClick={this.onNavBtnClick}
          onKeyDown={this.onKeydownHandler}
        >
          {item.title}
        </button>
      </li>
    );
  }

  render(): ReactNode {
    return (
      <Transition
        animate
        options={{
          easing: "ease",
          duration: 750,
        }}
      >
        <div className="transform-transition" ref={this.transformContainerRef}>
          <ul
            className={this.fullwidthClassName}
            ref={this.transformTransitionNavRef}
            onScroll={this.updateContentPositions}
          >
            {this.headerNavigation}
          </ul>
          <hr className="transform-transition__hr" />
          <div className="transform-transition__nav-follower" ref={this.followerRef} />
          <section className="transform-transition__content" ref={this.transformTransitionContentRef}>
            {this.content}
          </section>
        </div>
      </Transition>
    );
  }

  componentDidMount(): void {
    this.processInitialState();
  }

  componentDidUpdate(_prevProps: Readonly<TransformTransitionProps>, prevState: Readonly<TransformTransitionState>): void {
    this.onCurrentItemUpdate(prevState);
  }

  onCurrentItemUpdate = (prevState: Readonly<TransformTransitionState>): void => {
    if (prevState.currentItem !== this.state.currentItem) {
      this.updateContentPositions();
      this.updateContentNavigations();
    }
  }

  debouncedResizeCallback = debounce(() => {
    this.updateOnContentRefResize();
  }, 1, this.controller);

  processInitialState = (): void => {
    const { navBtnNodeList, contentItemNodeList } = this.state;

    this.transformTransitionNavBtnNodeList = this.transformTransitionNavRef.current?.querySelectorAll(navBtnNodeList);
    this.transformTransitionContentNodeList = this.transformTransitionContentRef.current?.querySelectorAll(contentItemNodeList);

    this.updateContentPositions();
    this.updateContentNavigations();

    this.resizeObserver = new ResizeObserverAPI(this.debouncedResizeCallback, this.controller);
    this.resizeObserver.observe(this.transformContainerRef.current);
  }

  updateOnContentRefResize = (): void => {
    this.transformTransitionContentNodeList.forEach((node) => {
      node.style.minWidth = `${this.transformTransitionContentRef?.current?.offsetWidth}px`;
    });
    this.updateContentPositions();
  }

  updateContentPositions = (): void => {
    if (this.followerRef.current && this.followerRef.current.style) {
      const navRef = this.transformTransitionNavRef.current;
      const scrollLeft = navRef.scrollLeft;
      this.followerRef.current.style.width = `${this.transformTransitionNavBtnNodeList?.[this.state.currentItem]?.offsetWidth}px`;
      this.followerRef.current.style.transform = `translate(${this.transformTransitionNavBtnNodeList?.[this.state.currentItem]?.offsetLeft - scrollLeft}px)`;
    }

    this.transformTransitionContentRef.current.style.transform = `translate(-${this.transformTransitionContentNodeList?.[this.state.currentItem]?.offsetLeft}px)`;
  }

  updateContentNavigations = (): void => {
    this.transformTransitionNavBtnNodeList?.forEach((node) => node.classList.remove("active"));
    this.transformTransitionNavBtnNodeList?.[this.state.currentItem]?.classList.add("active");

    this.transformTransitionContentNodeList?.forEach((node) => node.classList.remove("active"));
    this.transformTransitionContentNodeList?.[this.state.currentItem]?.classList.add("active");
  }

  onKeydownHandler = (evt: KeyboardEvent<HTMLButtonElement>): void => {
    if (evt.key !== "ArrowLeft" && evt.key !== "ArrowRight") return;

    this.setState(prevState => {
      let currentItem: number = 0;

      const onArrowLeft = (): void => {
        if (prevState.currentItem <= 0) {
          currentItem = this.props.list.length - 1;
        } else {
          currentItem = prevState.currentItem - 1;
        }
      };

      const onArrowRight = (): void => {
        if (prevState.currentItem >= this.props.list.length - 1) {
          currentItem = 0;
        } else {
          currentItem = prevState.currentItem + 1;
        }
      };

      switch (evt.key) {
        case "ArrowLeft": onArrowLeft(); break;
        case "ArrowRight": onArrowRight(); break;
      }

      return {
        ...prevState,
        currentItem,
      };
    });
  }

  onNavBtnClick = (evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState(prevState => {
      const target: HTMLButtonElement = evt.target as HTMLButtonElement;
      const currentItemAttr: string = target.getAttribute("current-item");
      const currentItem: number = Number(currentItemAttr);

      return {
        ...prevState,
        currentItem,
      };
    });
  }
}

export default TransformTransition;
