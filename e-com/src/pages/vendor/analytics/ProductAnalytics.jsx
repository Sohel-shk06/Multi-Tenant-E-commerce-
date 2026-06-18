import { useState, useEffect } from "react";
import {
  Package,
  AlertTriangle,
  Star,
  TrendingUp,
  Boxes,
  IndianRupee,
  Layers,
  FileEdit,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  Award,
  List,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { vendorService } from "../../../services/vendor.service";
// import { vendorProductService } from '../../../services/vendorProduct.service';

export const ProductAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState(null);

  useEffect(() => {
    loadData();
    loadAllproducts();
  }, []);

  const loadData = async () => {
    try {
      const result = await vendorService.getProductAnalytics();
      console.log('📊 Product Analytics Data:', result);
      setData(result);
      console.log("Product analytics data loaded:", result);
    } catch (error) {
      console.error("Failed to load product analytics", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllproducts = async () => {
    try {
      const result = await vendorService.getVendorProducts({
        page: 1,
        limit: 5,
      });
      setAllProducts(result.products);
      // console.log('all products:',result);
    } catch (error) {
      console.error("Failed to load all products", error);
    } finally {
      setLoading(false);
    }
  };

  const [dataa] = useState({
    stats: {
      totalProducts: 25,
      activeProducts: 18,
      draftProducts: 7,
      totalStock: 320,
      totalStockValue: 125000,
    },

    topProducts: [
      {
        _id: {
          title: "Wireless Headphones",
          images: [],
        },
        totalSold: 45,
        totalRevenue: 67500,
      },
      {
        _id: {
          title: "Smart Watch",
          images: [],
        },
        totalSold: 30,
        totalRevenue: 45000,
      },
    ],

    lowStockProducts: [
      {
        title: "Gaming Mouse",
        price: 1499,
        stock: 3,
      },
    ],

    productsWithoutReviews: [
      {
        title: "Laptop Stand",
        price: 999,
      },
    ],

    allProducts: [
      {
        title: "Wireless Headphones",
        price: 1500,
        stock: 25,
        status: "active",
        images: [],
      },
      {
        title: "Smart Watch",
        price: 2500,
        stock: 18,
        status: "active",
        images: [],
      },
      {
        title: "Gaming Mouse",
        price: 1499,
        stock: 3,
        status: "draft",
        images: [],
      },
    ],
  });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data)
    return <div className="p-6 text-gray-500">Failed to load dataa.</div>;

  const statCards = [
    {
      label: "Total Products",
      value: data.stats.totalProducts,
      icon: Package,
      from: "#6366F1",
      to: "#818CF8",
    },
    {
      label: "Active",
      value: data.stats.activeProducts,
      icon: Layers,
      from: "#22C55E",
      to: "#4ADE80",
    },
    {
      label: "Drafts",
      value: data.stats.draftProducts,
      icon: FileEdit,
      from: "#F59E0B",
      to: "#FBBF24",
    },
    {
      label: "Total Stock",
      value: data.stats.totalStock,
      icon: Boxes,
      from: "#06B6D4",
      to: "#22D3EE",
    },
    {
      label: "Stock Value",
      value: `₹${data.stats.totalStockValue.toLocaleString()}`,
      icon: IndianRupee,
      from: "#EC4899",
      to: "#F472B6",
    },
  ];

  const activePercent =
    data.stats.totalProducts > 0
      ? Math.round((data.stats.activeProducts / data.stats.totalProducts) * 100)
      : 0;
  const draftPercent = 100 - activePercent;

  const avgStockPerProduct =
    data.stats.totalProducts > 0
      ? Math.round(data.stats.totalStock / data.stats.totalProducts)
      : 0;

  const avgPrice =
    data.stats.totalStock > 0
      ? Math.round(data.stats.totalStockValue / data.stats.totalStock)
      : 0;

  const totalRevenueFromTop = data.topProducts.reduce(
    (sum, p) => sum + (p.totalRevenue || 0),
    0,
  );
  const totalUnitsSold = data.topProducts.reduce(
    (sum, p) => sum + (p.totalSold || 0),
    0,
  );

  // List of all products (requires backend to return data.allProducts)
  const pieDataa = [
    { name: "Active", value: dataa.stats.activeProducts },
    { name: "Draft", value: dataa.stats.draftProducts },
  ];

  const barDataa = dataa.topProducts.map((product) => ({
    name: product._id.title,
    sold: product.totalSold,
  }));

  const COLORS = ["#22C55E", "#F59E0B"];
const priceData = [
  { range: "₹0-500", products: 5 },
  { range: "₹500-1K", products: 8 },
  { range: "₹1K-5K", products: 12 },
  { range: "₹5K-10K", products: 4 },
  { range: "₹10K+", products: 2 },
];


  return (
    <div className="p-6 space-y-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
            Product Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Top products &amp; stock insights at a glance.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Live store dataa
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3 shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 text-white"
              style={{
                background: `linear-gradient(135deg, ${stat.from} 0%, ${stat.to} 100%)`,
              }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10"></div>
              <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/10"></div>
              <div className="relative w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div className="relative">
                <p className="text-xs text-white/80 font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-extrabold tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-white flex items-center justify-center shadow-sm">
              <BarChart3 className="w-4 h-4" />
            </span>
            Catalog Health
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Active products</span>
                <span className="font-bold text-green-600">
                  {activePercent}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  style={{ width: `${activePercent}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Draft products</span>
                <span className="font-bold text-amber-500">
                  {draftPercent}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full"
                  style={{ width: `${draftPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            {activePercent >= 70
              ? "Most of your catalog is live — great job!"
              : "Consider publishing more drafts to grow visibility."}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex flex-col justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center shadow-sm">
              <Boxes className="w-4 h-4" />
            </span>
            Avg. Stock / Product
          </h2>
          <div>
            <p className="text-4xl font-extrabold text-gray-900">
              {avgStockPerProduct}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              units per product on average
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Average price across inventory:{" "}
              <span className="font-bold text-gray-900">
                ₹{avgPrice.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex flex-col justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center shadow-sm">
              <Award className="w-4 h-4" />
            </span>
            Sales Summary
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Units sold (top products)
              </span>
              <span className="text-sm font-extrabold text-gray-900">
                {totalUnitsSold}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Revenue (top products)
              </span>
              <span className="text-sm font-extrabold text-green-600">
                ₹{totalRevenueFromTop.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Needs reviews</span>
              <span className="text-sm font-extrabold text-amber-500">
                {dataa.productsWithoutReviews.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
<<<<<<< HEAD
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-4 h-4" />
                </span>
                Top Selling Products
              </h2>
              <p className="text-xs text-gray-400 mt-1 ml-11">
                Ranked by units sold
              </p>
            </div>
          </div>
          {dataa.topProducts.length > 0 ? (
            <div className="space-y-1.5">
              {dataa.topProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center flex-shrink-0 ${
                      idx === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : idx === 1
                          ? "bg-gray-100 text-gray-600"
                          : idx === 2
                            ? "bg-orange-100 text-orange-600"
                            : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden ring-1 ring-gray-100">
                    {product._id?.images?.[0]?.url ? (
                      <img
                        src={product._id.images[0].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {product._id?.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <span>{product.totalSold} sold</span>
                      <span>·</span>
                      <span className="font-bold text-green-600">
                        ₹{product.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
=======
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
    Top Selling Products
  </h2>
  {data.topProducts && data.topProducts.length > 0 ? (
    <div className="space-y-3">
      {data.topProducts.map((item, idx) => {
        // ✅ Defensive coding - multiple fallbacks
        const product = item.product || {};
        const title = product.title || 'Unknown Product';
        const image = product.images?.[0]?.url || product.images?.[0] || null;
        
        return (
          <div key={idx} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-400" />
>>>>>>> origin/main
                </div>
              )}
            </div>
<<<<<<< HEAD
          ) : (
            <div className="flex flex-col items-center text-center py-12 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-900">No sales yet</p>
              <p className="text-xs text-gray-400 max-w-[260px]">
                Your best-selling products will show up here as orders come in.
              </p>
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 text-white flex items-center justify-center shadow-sm">
                <AlertTriangle className="w-4 h-4" />
              </span>
              Low Stock Alert
            </h2>
            <p className="text-xs text-gray-400 mt-1 ml-11">
              Products running low on inventory
            </p>
          </div>
          {dataa.lowStockProducts.length > 0 ? (
            <div className="space-y-1.5">
              {dataa.lowStockProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100"
                >
=======
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {title}
              </p>
              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                <span>{item.totalSold || 0} sold</span>
                <span>•</span>
                <span className="font-semibold text-green-600">
                  ₹{(item.totalRevenue || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-center text-gray-500 py-8">No sales yet.</p>
  )}
</div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Low Stock Alert
          </h2>
          {data.lowStockProducts && data.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {data.lowStockProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
>>>>>>> origin/main
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                      product.stock <= 5
                        ? "bg-red-500 text-white"
                        : "bg-orange-400 text-white"
                    }`}
                  >
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-12 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 text-green-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-900">
                All products are well stocked
              </p>
              <p className="text-xs text-gray-400 max-w-[260px]">
                You'll be alerted here as soon as any product stock runs low.
              </p>
            </div>
          )}
        </div>
      </div>

      

      {/* Products without reviews */}
<<<<<<< HEAD
      {data.productsWithoutReviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-300 to-amber-400 text-white flex items-center justify-center shadow-sm">
              <Star className="w-4 h-4" />
            </span>
=======
      {data.productsWithoutReviews && data.productsWithoutReviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
>>>>>>> origin/main
            Products Needing Reviews
          </h2>
          <p className="text-xs text-gray-400 mb-4 ml-11">
            These products have no reviews yet. Encourage customers to review!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dataa.productsWithoutReviews.map((product, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100 rounded-xl hover:shadow-sm transition-shadow"
              >
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {product.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Products Table */}
      {allProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-500 to-gray-700 text-white flex items-center justify-center shadow-sm">
              <List className="w-4 h-4" />
            </span>
            All Products
          </h2>
          <p className="text-xs text-gray-400 mb-4 ml-11">
            Full inventory with stock and pricing
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="py-2.5 pr-4 font-semibold">Product</th>
                  <th className="py-2.5 pr-4 font-semibold">Price</th>
                  <th className="py-2.5 pr-4 font-semibold">Stock</th>
                  <th className="py-2.5 pr-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden ring-1 ring-gray-100">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 truncate max-w-[220px]">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-700">
                      ₹{product.price?.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`font-bold ${product.stock <= 5 ? "text-red-600" : product.stock <= 15 ? "text-orange-500" : "text-gray-700"}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.status === "active" ? "Active" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
