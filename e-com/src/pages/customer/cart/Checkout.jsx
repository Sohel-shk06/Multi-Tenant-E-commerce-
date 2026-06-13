import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart } from '../../../app/store/cartSlice';
import api from '../../../services/api';
import { ArrowLeft, CreditCard, MapPin, CheckCircle, LogIn } from 'lucide-react';

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

                // ✅ FIX: Vendor ID multiple sources se try karo
                let vendorId = null;
                if (item.store?.vendor?._id) {
                    vendorId = item.store.vendor._id; // Populated vendor object
                } else if (typeof item.store?.vendor === 'string') {
                    vendorId = item.store.vendor; // Direct vendor ID string
                }

                if (!storeGroups[storeId]) {
                    storeGroups[storeId] = {
                        vendor: vendorId,  // ✅ Ab vendor ID properly aayega
                        store: storeId,
                        items: []
                    };
                }
                storeGroups[storeId].items.push({
                    product: item.productId,
                    quantity: item.quantity
                });
            });

            console.log('📦 Store groups:', storeGroups); // Debug log

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

    // ✅ Success Screen
    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
                    <p className="text-gray-600 mb-6">
                        {orderSuccess.orderCount} order{orderSuccess.orderCount > 1 ? 's' : ''} placed successfully.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm font-medium text-gray-700 mb-2">Order Number{orderSuccess.orderCount > 1 ? 's' : ''}:</p>
                        {orderSuccess.orderNumbers.map((num, idx) => (
                            <p key={idx} className="text-sm font-mono text-blue-600">{num}</p>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">Redirecting to your orders...</p>
                </div>
            </div>
        );
    }

    // ✅ Empty Cart - Redirect to Cart
    if (items.length === 0 && !isSubmitting) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to your cart before checkout.</p>
                    <Link to="/cart" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 inline-block">
                        Go to Cart
                    </Link>
                </div>
            </div>
        );
    }

    // ✅ Not Logged In - Show Login Prompt
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogIn className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please login with your customer account to place an order.</p>
                    <div className="space-y-3">
                        <Link
                            to="/login"
                            state={{ from: '/checkout' }}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 inline-block"
                        >
                            Go to Login
                        </Link>
                        <Link
                            to="/cart"
                            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 inline-block"
                        >
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Main Checkout Form
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate('/cart')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Cart</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handlePlaceOrder} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                                    Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Full Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    <input name="address" value={formData.address} onChange={handleChange} required placeholder="Street Address" className="md:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    <input name="city" value={formData.city} onChange={handleChange} required placeholder="City" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    <input name="state" value={formData.state} onChange={handleChange} required placeholder="State" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    <input name="zipCode" value={formData.zipCode} onChange={handleChange} required placeholder="ZIP Code" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                                        <span className="ml-3 font-medium text-gray-900">Cash on Delivery (COD)</span>
                                    </label>
                                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                                        <input type="radio" name="paymentMethod" value="stripe" disabled className="w-4 h-4" />
                                        <span className="ml-3 font-medium text-gray-900">Credit/Debit Card (Coming Soon)</span>
                                    </label>
                                </div>
                            </div>

                            {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Placing Order...' : `Place Order (₹${totalAmount.toLocaleString()})`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="text-gray-600 line-clamp-1 flex-1 mr-2">{item.title} (x{item.quantity})</span>
                                        <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Tax (18%)</span><span>₹{tax.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                                <div className="border-t pt-2 flex justify-between text-base font-bold text-gray-900">
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