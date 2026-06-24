import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart } from '../../../app/store/cartSlice';
import api from '../../../services/api';
import { ArrowLeft, CreditCard, MapPin, CheckCircle, LogIn, ShoppingBag } from 'lucide-react';

export const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        paymentMethod: 'cod'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(null);

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 500 ? 0 : 50;
    const totalAmount = subtotal + tax + shipping;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('Please login to place an order');
            return;
        }
        if (items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Group items by store
            const storeGroups = {};
            items.forEach(item => {
                const storeId = item.store?._id;
                if (!storeId) {
                    throw new Error('Store information missing for item: ' + item.title);
                }

                // FIX: Try vendor ID from populated object or direct string.
                let vendorId = null;
                if (item.store?.vendor?._id) {
                    vendorId = item.store.vendor._id;
                } else if (typeof item.store?.vendor === 'string') {
                    vendorId = item.store.vendor;
                }

                if (!storeGroups[storeId]) {
                    storeGroups[storeId] = {
                        vendor: vendorId,
                        store: storeId,
                        items: []
                    };
                }
                storeGroups[storeId].items.push({
                    product: item.productId,
                    quantity: item.quantity
                });
            });

            console.log('Store groups:', storeGroups);

            // Create order for each store
            const orderPromises = Object.values(storeGroups).map(group => {
                const orderPayload = {
                    customer: user._id,
                    vendor: group.vendor,
                    store: group.store,
                    items: group.items,
                    shippingAddress: formData,
                    paymentMethod: formData.paymentMethod
                };
                return api.post('/orders', orderPayload);
            });

            const results = await Promise.all(orderPromises);

            dispatch(clearCart());
            setOrderSuccess({
                orderCount: results.length,
                orderNumbers: results.map(r => r.data.data.orderNumber || 'Order Placed')
            });

            setTimeout(() => {
                navigate('/customer/orders');
            }, 3000);

        } catch (err) {
            console.error('Order placement error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E9E7F5] p-10 sm:p-12 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-11 h-11 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1E1E2F] tracking-tight mb-3">Order Placed Successfully!</h1>
                    <p className="text-sm font-medium text-[#6B7280] mb-6">
                        {orderSuccess.orderCount} order{orderSuccess.orderCount > 1 ? 's' : ''} placed successfully.
                    </p>
                    <div className="bg-[#F8F7FC] rounded-2xl border border-[#E9E7F5] p-4 mb-6 text-left">
                        <p className="text-sm font-semibold text-[#1E1E2F] mb-2">Order Number{orderSuccess.orderCount > 1 ? 's' : ''}:</p>
                        {orderSuccess.orderNumbers.map((num, idx) => (
                            <p key={idx} className="text-sm font-mono font-semibold text-[#6C4EFF]">{num}</p>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-[#6B7280]">Redirecting to your orders...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0 && !isSubmitting) {
        return (
            <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E9E7F5] p-10 sm:p-12 max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#EEE9FF] text-[#6C4EFF] mx-auto mb-5 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#1E1E2F] tracking-tight mb-3">Your cart is empty</h2>
                    <p className="text-sm font-medium text-[#6B7280] mb-6">Add some products to your cart before checkout.</p>
                    <Link to="/cart" className="w-full bg-[#6C4EFF] text-white py-3 rounded-xl font-semibold shadow-sm hover:bg-[#5B3EE0] hover:shadow-md transition-all duration-200 inline-block">
                        Go to Cart
                    </Link>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E9E7F5] p-10 sm:p-12 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-[#EEE9FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <LogIn className="w-8 h-8 text-[#6C4EFF]" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#1E1E2F] tracking-tight mb-3">Login Required</h2>
                    <p className="text-sm font-medium text-[#6B7280] mb-6">Please login with your customer account to place an order.</p>
                    <div className="space-y-3">
                        <Link
                            to="/login"
                            state={{ from: '/checkout' }}
                            className="w-full bg-[#6C4EFF] text-white py-3 rounded-xl font-semibold shadow-sm hover:bg-[#5B3EE0] hover:shadow-md transition-all duration-200 inline-block"
                        >
                            Go to Login
                        </Link>
                        <Link
                            to="/cart"
                            className="w-full border border-[#E9E7F5] bg-white text-[#1E1E2F] py-3 rounded-xl font-semibold hover:bg-[#F8F7FC] hover:text-[#6C4EFF] transition-colors inline-block"
                        >
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F7FC] py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate('/cart')} className="flex items-center space-x-2 text-[#6B7280] hover:text-[#6C4EFF] mb-6 font-semibold transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back to Cart</span>
                </button>

                <div className="mb-8 text-left">
                    <h1 className="text-3xl font-extrabold text-[#1E1E2F] tracking-tight">Checkout</h1>
                    <p className="text-sm font-medium text-[#6B7280] mt-1">Confirm delivery details and place your order.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl shadow-sm border border-[#E9E7F5] p-6 space-y-7">
                            <div>
                                <h2 className="text-lg font-bold text-[#1E1E2F] mb-4 flex items-center">
                                    <span className="w-9 h-9 rounded-xl bg-[#EEE9FF] text-[#6C4EFF] flex items-center justify-center mr-3">
                                        <MapPin className="w-5 h-5" />
                                    </span>
                                    Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Full Name" className="w-full px-3.5 py-2.5 border border-[#E9E7F5] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF]" />
                                    <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone Number" className="w-full px-3.5 py-2.5 border border-[#E9E7F5] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF]" />
                                    <input name="address" value={formData.address} onChange={handleChange} required placeholder="Street Address" className="md:col-span-2 w-full px-3.5 py-2.5 border border-[#E9E7F5] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF]" />
                                    <input name="city" value={formData.city} onChange={handleChange} required placeholder="City" className="w-full px-3.5 py-2.5 border border-[#E9E7F5] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF]" />
                                    <input name="state" value={formData.state} onChange={handleChange} required placeholder="State" className="w-full px-3.5 py-2.5 border border-[#E9E7F5] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF]" />
                                    <input name="zipCode" value={formData.zipCode} onChange={handleChange} required placeholder="ZIP Code" className="w-full px-3.5 py-2.5 border border-[#E9E7F5] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF]" />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-[#1E1E2F] mb-4 flex items-center">
                                    <span className="w-9 h-9 rounded-xl bg-[#EEE9FF] text-[#6C4EFF] flex items-center justify-center mr-3">
                                        <CreditCard className="w-5 h-5" />
                                    </span>
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border border-[#6C4EFF] bg-[#EEE9FF]/60 rounded-2xl cursor-pointer">
                                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="w-4 h-4 text-[#6C4EFF]" />
                                        <span className="ml-3 font-semibold text-[#1E1E2F]">Cash on Delivery (COD)</span>
                                    </label>
                                    <label className="flex items-center p-4 border border-[#E9E7F5] rounded-2xl cursor-not-allowed bg-[#F8F7FC] opacity-70">
                                        <input type="radio" name="paymentMethod" value="stripe" disabled className="w-4 h-4" />
                                        <span className="ml-3 font-semibold text-[#6B7280]">Credit/Debit Card (Coming Soon)</span>
                                    </label>
                                </div>
                            </div>

                            {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium">{error}</div>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#6C4EFF] text-white py-3 rounded-xl font-semibold shadow-sm hover:bg-[#5B3EE0] hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Placing Order...' : `Place Order (₹${totalAmount.toLocaleString()})`}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-[#E9E7F5] p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-[#1E1E2F] mb-4">Order Summary</h2>
                            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-1">
                                {items.map(item => (
                                    <div key={item.productId} className="flex justify-between gap-3 text-sm">
                                        <span className="text-[#6B7280] line-clamp-1 flex-1">{item.title} (x{item.quantity})</span>
                                        <span className="font-semibold text-[#1E1E2F]">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-[#E9E7F5] pt-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-[#6B7280]">Subtotal</span><span className="font-medium text-[#1E1E2F]">₹{subtotal.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-[#6B7280]">Tax (18%)</span><span className="font-medium text-[#1E1E2F]">₹{tax.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-[#6B7280]">Shipping</span><span className="font-medium text-[#1E1E2F]">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                                <div className="border-t border-[#E9E7F5] pt-3 flex justify-between text-base font-bold text-[#1E1E2F]">
                                    <span>Total</span><span>₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
