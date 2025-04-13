import { PureComponent, ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { RouteItem } from "./RouterView";

type RouterRoutesProps = {
  routesMap: Map<string, RouteItem>;
}

class RouterRoutes extends PureComponent<RouterRoutesProps> {
  render(): ReactNode {
    const routes: [string, RouteItem][] = Array.from(this.props.routesMap);
    return (
      <Routes>
        {routes.map(([,{ path, element, index }]) =>
          <Route
            key={path}
            path={path}
            element={element}
            index={index}
          />
        )}
      </Routes>
    );
  }
}

export default RouterRoutes;
