import withLazyLoadedWrap from "../../../Hocs/withLazyLoadWrapper"; 
import { lazy } from "react";
const Home = withLazyLoadedWrap(lazy(() => import("components/Views/Home/Home")));
const Aboutus = withLazyLoadedWrap(lazy(() => import("components/Views/AboutUs/AboutUs")));
const Contact = withLazyLoadedWrap(lazy(() => import("components/Views/Contact/Contact")));
const CatalogList = withLazyLoadedWrap(lazy(() => import("components/Views/Catalog/CatalogList/CatalogList")));
const ClothesDetails = withLazyLoadedWrap(lazy(() => import("components/Views/Catalog/CatalogDetails/CatalogDetails")));
const Error404 = withLazyLoadedWrap(lazy(() => import("components/Views/Errors/error404/404")));
const Cart = withLazyLoadedWrap(lazy(() => import("components/Views/Cart/Cart")));
const WishList = withLazyLoadedWrap(lazy(() => import("components/Views/WishList/WishList")));
const Authentication = withLazyLoadedWrap(lazy(() => import("components/Views/Authentication/Authentication")));
const Checkout = withLazyLoadedWrap(lazy(() => import("components/Views/Checkout/Checkout")));
const Profile = withLazyLoadedWrap(lazy(() => import("components/Views/Authentication/Profile/Profile")));

export {
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
};
