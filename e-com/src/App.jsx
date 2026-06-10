import { useState } from "react";
import CustomerLayout from "./layouts/CustomerLayout";
import Home from "./pages/customer/home/Home";
import ProductList from "./pages/customer/products/ProductList";
import ProductDetails from "./pages/customer/products/ProductDetails";
import StoreList from "./pages/customer/stores/StoreList";
import StoreDetails from "./pages/customer/stores/StoreDetails";

const previewPages = [
  { id: "home", label: "Home" },
  { id: "products", label: "Products" },
  { id: "product-detail", label: "Product Detail" },
  { id: "stores", label: "Stores" },
  { id: "store-detail", label: "Store Detail" },
];

const App = () => {
  const [view, setView] = useState("home");

  const renderPage = () => {
    if (view === "products") return <ProductList />;
    if (view === "product-detail") return <ProductDetails />;
    if (view === "stores") return <StoreList />;
    if (view === "store-detail") return <StoreDetails />;

    return <Home />;
  };

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[9999] flex justify-center space-x-4 bg-gray-900 p-2 text-xs text-white">
        {previewPages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => setView(page.id)}
            className={`rounded-lg px-3 py-1.5 font-semibold transition ${
              view === page.id
                ? "bg-[#cd6615] text-white"
                : "text-gray-200 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      <div className="pt-10">
        <CustomerLayout>{renderPage()}</CustomerLayout>
      </div>
    </>
  );
};

export default App;
