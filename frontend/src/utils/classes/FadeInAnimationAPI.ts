export interface FadeInAnimationAPIInit {
  frames: Keyframe[] | PropertyIndexedKeyframes | null;
  options: number | KeyframeAnimationOptions;
}

/**
 * This is a class that observes any changes in DOM, if any child nodes of target node is mutated in the following form:
 * added, removed, changed triggers this class to animate it. Fade in animation is used here.
 */
class FadeInAnimationAPI {
  public node: HTMLElement;
  public mutationObserver: MutationObserver;

  private animationFrames: Keyframe[] | PropertyIndexedKeyframes | null = [
    { opacity: 0 },
    { opacity: 1 },
  ];

  private animationOptions: number | KeyframeAnimationOptions = {
    duration: 400,
  };

  constructor(node: HTMLElement, init?: FadeInAnimationAPIInit) {
    this.node = node;

    if (init) {
      this.animationFrames = init?.frames;
      this.animationOptions = init?.options;
    }

    this.observeMutations = this.observeMutations.bind(this);
    this.mutationObserver = new MutationObserver(this.observeMutations);
  }

  public observe(): void {
    this.mutationObserver.observe(this.node, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  public unobserve(): void {
    this.mutationObserver.disconnect();
  }

  private isExceptionNode(node: HTMLElement | SVGElement): boolean {
    return (
      node.closest(".leaflet-container") !== null ||
      node.closest(".leaflet-container *") !== null ||
      node.matches(".no-animation")
    );
  }

  private observeMutations(mutations: MutationRecord[]): void {
    try {
      for (let i: number = 0; i < mutations.length; ++i) {
        const mutation: MutationRecord = mutations[i];

        for (let j: number = 0; j < mutation.addedNodes.length; ++j) {
          const addedNode: Node = mutation.addedNodes[j];

          if (addedNode instanceof HTMLElement || addedNode instanceof SVGElement) {
            if (this.isExceptionNode(addedNode)) continue;
            addedNode.animate(
              this.animationFrames,
              this.animationOptions
            );
          }
        }
      }
    } catch (err) {
      console.error("Error observing mutations: " + err);
    }
  }
}

export default FadeInAnimationAPI;
