import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
export function activeClassNameObserver(pathname: string, className: string): string {
  const location = useLocation();
  const [pathWithoutLang, setPathWithoutLang] = useState<string>("");
  useEffect(() => {
    const splitted = location.pathname.split("/");
    let newPathWithoutLang = "";
    for (let i = 0; i < splitted.length; ++i) { if (i > 1) { newPathWithoutLang += `/${splitted[i]}`; } }
    setPathWithoutLang(newPathWithoutLang);
  }, [location.pathname]);
  return useMemo(() => (pathWithoutLang === pathname ? `${className} active` : className), [pathWithoutLang, pathname, className]);
}