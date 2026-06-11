import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import CustomerLayout from "./layouts/CustomerLayout";
import Home from "./pages/customer/home/Home";
import ProductList from "./pages/customer/products/ProductList";
import ProductDetails from "./pages/customer/products/ProductDetails";
import StoreList from "./pages/customer/stores/StoreList";
import StoreDetails from "./pages/customer/stores/StoreDetails";
import CategoryList from "./pages/customer/categories/CategoryList";
import CategoryProducts from "./pages/customer/categories/CategoryProducts";
import Wishlist from "./pages/customer/wishlist/Wishlist";

const App = () => {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <CustomerLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/stores" element={<StoreList />} />
            <Route path="/stores/:id" element={<StoreDetails />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/:categoryName" element={<CategoryProducts />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </CustomerLayout>
      </WishlistProvider>
    </BrowserRouter>
  );
};

export default App;
