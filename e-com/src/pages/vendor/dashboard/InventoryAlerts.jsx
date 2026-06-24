import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const InventoryAlerts = ({ products = [] }) => {
  const lowStockProducts = products.filter((product) => product.stock <= 10);

  // console.log("InventoryAlerts component rendered with products:", products);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Inventory Alerts
          </h2>
        </div>

        <Link
          to="/vendor/products"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      {lowStockProducts.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-500">
          All products are well stocked 🎉
        </div>
      ) : (
        <div className="space-y-4">
          {lowStockProducts.slice(0, 5).map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {/* <img
                  src={
                    product.images?.[0]?.url ||
                    product.image ||
                    "/placeholder-product.png"
                  }
                  alt={product.title}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                /> */}

                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {product.title}
                  </h3>

                  {/* <p className="text-xs text-gray-500">
                    SKU: {product.sku}
                  </p> */}
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-red-600">
                  {product.stock} left
                </p>

                <p className="text-xs text-gray-500">Low Stock</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryAlerts;
