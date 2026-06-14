import React from "react";
import { Link } from "react-router-dom";

const TopProducts = ({ products = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Top Selling Products
        </h2>

        <Link 
        to = "/vendor/products"
        className="text-sm text-blue-600 hover:text-blue-700">
          View All
        </Link>
      </div>

      <div className="space-y-5">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex items-center gap-4"
          >
            {/* Product Image */}
            {/* <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover border"
            /> */}

            {/* Product Info */}
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-800">
                  {product.name}
                </h3>

                <span className="text-sm font-semibold text-gray-900">
                  ₹{product.revenue?.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-violet-600 h-2 rounded-full"
                  style={{
                    width: `${product.percentage}%`,
                  }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {product.sold} sold
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;