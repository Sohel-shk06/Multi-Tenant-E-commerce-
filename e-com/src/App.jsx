import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import CustomerLayout from "./layouts/CustomerLayout";
import AccountLayout from "./layouts/AccountLayout";

// Customer General Pages
import Home from "./pages/customer/home/Home";
import ProductList from "./pages/customer/products/ProductList";
import ProductDetails from "./pages/customer/products/ProductDetails";
import StoreList from "./pages/customer/stores/StoreList";
import StoreDetails from "./pages/customer/stores/StoreDetails";
import CategoryList from "./pages/customer/categories/CategoryList";
import CategoryProducts from "./pages/customer/categories/CategoryProducts";
import Wishlist from "./pages/customer/wishlist/Wishlist";

// Customer Account & Post-Purchase Hub Pages
import MyProfile from "./pages/customer/profile/MyProfile";
import AddressBook from "./pages/customer/profile/AddressBook";
import SavedCards from "./pages/customer/profile/SavedCards";
import MyOrders from "./pages/customer/orders/MyOrders";
import OrderDetails from "./pages/customer/orders/OrderDetails";
import TrackOrder from "./pages/customer/orders/TrackOrder";
import MyReviews from "./pages/customer/reviews/MyReviews";
import WriteReview from "./pages/customer/reviews/WriteReview";

const App = () => {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <CustomerLayout>
          <Routes>
            {/* General Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/stores" element={<StoreList />} />
            <Route path="/stores/:id" element={<StoreDetails />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/:categoryName" element={<CategoryProducts />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Nested Account Routes */}
            <Route element={<AccountLayout />}>
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/orders/:orderId/track" element={<TrackOrder />} />
              <Route path="/addresses" element={<AddressBook />} />
              <Route path="/saved-cards" element={<SavedCards />} />
              <Route path="/reviews" element={<MyReviews />} />
              <Route path="/reviews/write" element={<WriteReview />} />
            </Route>
          </Routes>
        </CustomerLayout>
      </WishlistProvider>
    </BrowserRouter>
  );
};

export default App;

