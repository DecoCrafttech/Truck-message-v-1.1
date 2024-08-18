import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeV1 from './components/home-v1';

import About from './components/about';
import Service from './components/service';
import ServiceDetails from './components/service-details';
import loadavailability from './components/loadavailability';
import PortfolioV2 from './components/portfolio-v2';
import truck_availability from './components/truckavailability';
// import truckavailability from './components/truckavailability';
import Team from './components/team';
import TeamDetails from './components/team-details';
import Faq from './components/faq';
import ComingSoon from './components/coming-soon';
import Error from './components/404';
import Location from './components/location';
import Loadavailablity from './components/loadavailability';
import FuelPrice from "./components/FuelPrice";


import Shop from './components/shop';
import ShopGrid from './components/shop-grid';
import ProdductDetails from './components/product-details';
import ShopLeftSidebar from './components/shop-left-sidebar';
import ShopRightSidebar from './components/shop-right-sidebar';

import BlogGrid from './components/blog-grid';
import BlogLeftSidebar from './components/blog-left-sidebar';
import BlogRightSidebar from './components/blog-right-sidebar';
import Blog from './components/blog';

import BlogDetails from './components/blog-details';
import Contact from './components/contact';
import Cart from './components/cart';
import Checkout from './components/checkout';
import MyAccount from './components/my-account';
import Login from './components/login';
import Register from './components/register';
import AddListing from './components/add-listing';
import Wishlist from './components/wishlist';
import OrderTracking from './components/order-tracking';
import History from './components/history';
import SignInPage from './components/section-components/signInPage';
import { Toaster } from "react-hot-toast";
import Navbar from "./components/global-components/navbar";
import Footer from './components/global-components/footer';
import Profile from "./components/Profile";
import { ExpenseCalculator } from "./components/ExpenseCalculator";
import ExpenseDetails from "./components/ExpenseDetails";
import TollCalculator from "./components/TollCalculator";
import { useEffect } from "react";
import ChatView from "./components/Chat/Chat";

function App() {

 

  return (
    <>
      <Toaster />

      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeV1 />} />
          <Route path="/my_profile" element={<Profile />} />
          <Route path="/signInPage" element={<SignInPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/service-details" element={<ServiceDetails />} />

          <Route path="/load-availability" element={<Loadavailablity />} />
          <Route path="/portfolio-v2" element={<PortfolioV2 />} />
          {/* ? */}
          <Route path="/truck_availability" element={<truck_availability />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team-details" element={<TeamDetails />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/404" element={<Error />} />
          <Route path="/location" element={<Location />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop-grid" element={<ShopGrid />} />
          <Route path="/shop-left-sidebar" element={<ShopLeftSidebar />} />
          <Route path="/shop-right-sidebar" element={<ShopRightSidebar />} />

          {/* <Route path="/load-availabilitypage" element={ <Loadavailablity/> } /> */}


          <Route path="/product-details" element={<ProdductDetails />} />
          {/* blog */}
          <Route path="/blog-grid" element={<BlogGrid />} />
          <Route path="/blog-left-sidebar" element={<BlogLeftSidebar />} />
          <Route path="/blog-right-sidebar" element={<BlogRightSidebar />} />
          <Route path="/blog" element={<Blog />} />


          <Route path="/blog-details" element={<BlogDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-listing" element={<AddListing />} />
          <Route path="/toll-calculator" element={<TollCalculator />} />


          <Route path="/wishlist" element={<Wishlist />}>
            <Route path="load" />
            <Route path="truck" />
            <Route path="driver" />
            <Route path="buy_sell" />
          </Route>


          <Route path="/expense-calculator" element={<ExpenseCalculator />} />
          <Route path="/expense-details/:id" element={<ExpenseDetails />} />
          <Route path="/fuelprice" element={<FuelPrice />} />


          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/history" element={<History />} />
          <Route path="/chat" element={<ChatView />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
