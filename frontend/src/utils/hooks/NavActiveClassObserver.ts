export function activeClassNameObserver(pathname: string, className: string): string {
    const splitted: string[] = location.pathname.split("/");
    let pathWithoutLang: string = "";
  
    for (let i = 0; i < splitted.length; ++i) {
      if (i > 1) {
        pathWithoutLang += `/${splitted[i]}`;
      }
    }
    console.log(pathname, className)
    return (pathWithoutLang === pathname) ? `${className} active `: className;
}