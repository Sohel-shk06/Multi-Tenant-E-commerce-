import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../../app/store/cartSlice';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping above 500
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 sm:p-12 rounded-2xl shadow-sm border border-[#E9E7F5] max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-[#EEE9FF] text-[#6C4EFF] mx-auto mb-5 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1E1E2F] mb-2 tracking-tight">Your cart is empty</h2>
          <p className="text-sm font-medium text-[#6B7280] mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="inline-flex items-center space-x-2 bg-[#6C4EFF] text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-[#5B3EE0] hover:shadow-md transition-all duration-200">
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-extrabold text-[#1E1E2F] tracking-tight">Shopping Cart</h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">Review your items and continue to checkout.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl shadow-sm border border-[#E9E7F5] p-4 flex flex-col sm:flex-row gap-4 transition-all duration-200 hover:shadow-md">
                <div className="w-full sm:w-24 h-24 bg-[#F8F7FC] rounded-xl flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-[#6B7280]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-[#1E1E2F] line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-[#6B7280] mt-1">{item.store?.name}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 gap-4">
                    <div className="flex items-center border border-[#E9E7F5] rounded-xl bg-white overflow-hidden">
                      <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))} className="px-3 py-1.5 text-[#6B7280] hover:bg-[#EEE9FF] hover:text-[#6C4EFF]">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1.5 font-semibold text-[#1E1E2F] border-x border-[#E9E7F5]">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))} className="px-3 py-1.5 text-[#6B7280] hover:bg-[#EEE9FF] hover:text-[#6C4EFF]">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-[#1E1E2F]">₹{(item.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => dispatch(removeFromCart(item.productId))} className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E9E7F5] p-6 sticky top-24">
              <h2 className="text-lg font-bold text-[#1E1E2F] mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Subtotal</span>
                  <span className="font-medium text-[#1E1E2F]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Tax (18%)</span>
                  <span className="font-medium text-[#1E1E2F]">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Shipping</span>
                  <span className="font-medium text-[#1E1E2F]">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="border-t border-[#E9E7F5] pt-3 flex justify-between text-base font-bold text-[#1E1E2F]">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#6C4EFF] text-white py-3 rounded-xl font-semibold shadow-sm hover:bg-[#5B3EE0] hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link to="/products" className="block text-center text-sm font-semibold text-[#6C4EFF] hover:text-[#5B3EE0] mt-4 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
