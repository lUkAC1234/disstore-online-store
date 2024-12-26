class MetaElements {
  static createScriptTag(src: string, otherAttributes?: Record<string, string>): HTMLScriptElement {
    const script: HTMLScriptElement = document.createElement("script");
    script.setAttribute("src", src);
    this.setAttributes(script, otherAttributes);
    return script;
  }

  static createLinkCssTag(href: string, otherAttributes?: Record<string, string>): HTMLLinkElement {
    const linkCss: HTMLLinkElement = document.createElement("link");
    linkCss.setAttribute("href", href);
    linkCss.setAttribute("rel", "stylesheet");
    this.setAttributes(linkCss, otherAttributes);
    return linkCss;
  }

  static createScriptTagAndAttachToHead(src: string, otherAttributes?: Record<string, string>): void {
    const script: HTMLScriptElement = this.createScriptTag(src, otherAttributes);
    this.attachToHead(script);
  }

  static createLinkCssTagAndAttachToHead(href: string, otherAttributes?: Record<string, string>): void {
    const linkCss: HTMLLinkElement = this.createLinkCssTag(href, otherAttributes);
    this.attachToHead(linkCss);
  }

  static attachToHead(metaElement: HTMLElement): void {
    document.head.appendChild(metaElement);
  }

  private static setAttributes(node: HTMLElement, attributes: Record<string, string>): void {
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        node.setAttribute(key, value);
      }
    }
  }
}

export default MetaElements;
