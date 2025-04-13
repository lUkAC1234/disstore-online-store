import i18next from "i18next";
import { PureComponent, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
    Home,
    Aboutus,
    Contact,
    CatalogList,
    ClothesDetails,
    Error404,
    Cart,
    WishList,
    Authentication,
    Checkout,
    Profile,
} from "./AsyncViews";
import RouterRoutes from "./Routes";
import Header from "components/Layout/Header/Header";
import Footer from "../Footer/Footer";
import withRouter from "../../../Hocs/withRouter";

export type RouteItem = {
    path: string;
    element: ReactNode;
    index?: boolean;
}

type RouterViewState = {
    routesMap: Map<string, RouteItem>;
}

type RouterViewProps = {
    pathname: string;
}

class RouterView extends PureComponent<RouterViewProps, RouterViewState> {
    state: Readonly<RouterViewState> = {
        routesMap: new Map([
            ["/", { path: "/", element: <Navigate to={`/${i18next.language}`} />, index: true }],
            ["/:lang", { path: "/:lang", element: <Home />, index: true }],
            ["/:lang/about/us", { path: "/:lang/about/us", element: <Aboutus /> }],
            ["/:lang/contact/us", { path: "/:lang/contact/us", element: <Contact /> }],
            ["/:lang/catalog", { path: "/:lang/catalog", element: <CatalogList /> }],
            ["/:lang/catalog/clothes/:id", { path: "/:lang/catalog/clothes/:slug", element: <ClothesDetails /> }],
            ["/:lang/cart", { path: "/:lang/cart", element: <Cart /> }],
            ["/:lang/checkout", { path: "/:lang/checkout", element: <Checkout /> }],
            ["/:lang/favorites", { path: "/:lang/favorites", element: <WishList /> }],
            ["/:lang/authentication", { path: "/:lang/authentication", element: <Authentication /> }],
            ["/:lang/profile", { path: "/:lang/profile", element: <Profile /> }],
            ["/*", { path: "/*", element: <Error404 /> }],
        ]),
    };

    render(): ReactNode {
        const segments = this.props.pathname.split("/");
        const hideLayout = segments[2] === "authentication";
        return (
            <>
                {!hideLayout && <Header />}
                <main className={`main ${hideLayout ? "no-header" : ""}`}>
                    <RouterRoutes routesMap={this.state.routesMap} />
                    <Outlet />
                </main>
                {!hideLayout && <Footer />}
            </>
        );
    }
}

const WithRouter = withRouter(RouterView);

export default WithRouter;
