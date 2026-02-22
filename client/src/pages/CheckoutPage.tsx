import { useNavigate, useLocation } from "react-router-dom";

function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Data passed from ProductDetailPage
    const { selectedSku, selectedEmi, productName, productBrand } = location.state || {};

    // Fallback if accessed directly without state
    if (!selectedSku) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl mb-4">No item selected for checkout.</p>
                <button onClick={() => navigate("/")} className="px-6 py-2 bg-black text-white rounded-lg">Go Home</button>
            </div>
        );
    }

    const finalPrice = selectedSku.price;

    return (
        <div className="w-full min-h-screen flex items-center justify-center font-sans p-6">
            <div className="w-full h-auto flex flex-col items-center max-w-2xl border-2 border-gray-600 p-10 rounded-2xl bg-white shadow-xl">
                <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

                <div className="w-full space-y-4 mb-8">
                    <div className="flex justify-between items-center border-b pb-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-blue-600 font-semibold">{productBrand}</span>
                            </div>
                            <span className="text-xl font-bold">{productName}</span>
                            <div className="flex gap-2">
                                <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">{selectedSku.color}</span>
                                <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">{selectedSku.storage}</span>
                                {selectedSku.finish && <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">{selectedSku.finish}</span>}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold">₹{finalPrice}</span>
                        </div>
                    </div>

                    {selectedEmi ? (
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <h3 className="font-bold text-green-800 mb-1">Payment: EMI Plan ({selectedEmi.lender})</h3>
                            <p className="text-green-700">{selectedEmi.months} months x ₹{Math.round(finalPrice / selectedEmi.months)}</p>
                            {selectedEmi.cashback > 0 && <p className="text-xs text-green-600">Total Cashback: ₹{selectedEmi.cashback}</p>}
                        </div>
                    ) : (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-blue-800">
                            <h3 className="font-bold mb-1">Payment: Full Payment</h3>
                            <p className="mb-2">One-time payment of ₹{finalPrice}</p>
                            {selectedSku.paymentOptions && selectedSku.paymentOptions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedSku.paymentOptions.map((opt: string) => (
                                        <span key={opt} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold border border-blue-200">
                                            {opt}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-2 pt-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{finalPrice}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery</span>
                            <span className="text-green-600 font-bold">FREE</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t pt-4">
                            <span>Total</span>
                            <span>₹{finalPrice}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 px-6 py-4 border border-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => navigate("/?orderPlaced=true")}
                        className="flex-[2] px-6 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all transform active:scale-95 shadow-lg"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
