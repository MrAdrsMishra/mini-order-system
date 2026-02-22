import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import a from "../assets/image.png";
import { useProductManagerStore } from "../store/ProductManagerStore";

function ProductDetailPage() {
    const { product_id } = useParams();
    const navigate = useNavigate();

    const [productImageIndex, setProductImageIndex] = useState(0);
    const loadProductDetails = useProductManagerStore((state) => state.loadProductDetails);
    const loadEmiBySku = useProductManagerStore((state) => state.loadEmiBySku);
    const productDetailsMap = useProductManagerStore((state) => state.productDetails);
    const loading = useProductManagerStore((state) => state.loading);
    const error = useProductManagerStore((state) => state.error);

    const product = product_id ? productDetailsMap[product_id] : null;

    const [selectedStorage, setSelectedStorage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    const [selectedEmiIndex, setSelectedEmiIndex] = useState<number | null>(null);

    const selectedSku = product?.skus.find(
        s => s.storage === selectedStorage && s.color === selectedColor
    ) || product?.skus[0];

    useEffect(() => {
        if (product_id) {
            loadProductDetails(product_id);
        }
    }, [product_id, loadProductDetails]);

    useEffect(() => {
        if (product && product.skus.length > 0) {
            setSelectedStorage(product.skus[0].storage);
            setSelectedColor(product.skus[0].color);
            setSelectedEmiIndex(null); // Reset EMI selection on product/sku change
        }
    }, [product_id, product?.productId]); // Reset when navigating to a new product

    useEffect(() => {
        if (selectedSku && product_id) {
            loadEmiBySku(selectedSku.skuId, product_id);
            setSelectedEmiIndex(null); // Reset selection when variant changes
        }
    }, [selectedSku?.skuId, product_id, loadEmiBySku]);

    if (loading && !product) return <div className="p-10 text-center">Loading...</div>;
    if (error && !product) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!product) return <div className="p-10 text-center">Product not found</div>;

    const availableColors = Array.from(new Set(product.skus.map(s => s.color)));
    const availableStoragesForColor = Array.from(new Set(product.skus.filter(s => s.color === selectedColor).map(s => s.storage)));

    const handleMouseZoom = (e: React.MouseEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        img.style.transform = "scale(1.5) translate(2%,10%)";
        img.style.transition = "transform 0.3s ease-in-out";
        img.style.transformOrigin = "center";
    };

    const handleMouseZoomOut = (e: React.MouseEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        img.style.transform = "scale(1)";
        img.style.transition = "transform 0.3s ease-in-out";
        img.style.transformOrigin = "center";
    };

    const currentImages = selectedSku?.images.length ? selectedSku.images : [a];

    return (
        <div className="p-10 min-h-screen font-sans">
            <div className="grid grid-cols-2 gap-10 border border-gray-600 p-10 rounded-2xl">

                {/* LEFT SIDE - IMAGE */}
                <div className="flex flex-col items-center  ">

                    <div className=" w-96 h-96 border border-gray-300 rounded-xl flex items-center justify-center">
                        <img
                            src={currentImages[productImageIndex]}
                            alt={product.name}
                            onMouseEnter={(e) => handleMouseZoom(e)}
                            onMouseLeave={(e) => handleMouseZoomOut(e)}
                            className="object-fit h-full transition-all duration-300"
                        />
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="flex gap-3 mt-5">
                        {currentImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt=""
                                onClick={() => setProductImageIndex(index)}
                                className={`w-20 h-20 p-2 cursor-pointer object-contain ${index === productImageIndex
                                    ? "border-2 rounded-md border-black" : "border border-gray-200 rounded-md"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE - INFO */}
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                        <p className="text-gray-600 mt-2">{`${product.description} | ${product.processor} | ${product.display} | ${product.camera} | ${product.battery} | ${product.charging} | ${product.networks}`}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-black">₹{selectedSku?.price || "N/A"}</span>
                        {selectedSku?.stock === 0 && <span className="text-red-500 font-semibold">Out of Stock</span>}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Color</h2>
                        <div className="flex gap-2">
                            {availableColors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={` min-w-20 h-10 p-2 rounded-xl border transition-all ${selectedColor === color
                                        ? "text-md text-black border-2 border-gray-600"
                                        : "border-gray-300 hover:border-2 hover:border-gray-600"
                                        }`}
                                >
                                    {color ? color : "N/A"} {selectedSku?.finish && <span className="text-xs"> {selectedSku.finish}</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Storage</h2>
                        <div className="flex gap-2">
                            {availableStoragesForColor.map((storage) => (
                                <button
                                    key={storage}
                                    onClick={() => setSelectedStorage(storage)}
                                    className={`px-4 py-2 rounded-xl border transition-all ${selectedStorage === storage
                                        ? "text-md text-black border-black"
                                        : "border-gray-300 hover:border-black"
                                        }`}
                                >
                                    {storage}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* EMI Plans */}
                    {selectedSku?.emiPlans && selectedSku.emiPlans.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-xl font-bold mb-4">EMI Plans</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {selectedSku.emiPlans.map((plan, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedEmiIndex(index)}
                                        className={`cursor-pointer border p-4 rounded-xl shadow-sm transition-all ${selectedEmiIndex === index
                                            ? "border-black border-2 bg-gray-50"
                                            : "border-gray-200 hover:border-black"}`}
                                    >
                                        <p className="font-bold text-lg">{plan.months} Months X ₹{Math.round(selectedSku.price / plan.months)}</p>
                                        <p className="text-green-600 text-sm font-semibold">
                                            {plan.cashback ? `Cashback: ₹${plan.cashback}` : "No Cashback"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{plan.lender} | {plan.roi}% APR</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 px-6 py-3 border border-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Go Back
                        </button>

                        <button
                            disabled={selectedSku?.stock === 0}
                            onClick={() => navigate(`/checkout/${product_id}`, {
                                state: {
                                    selectedSku,
                                    selectedEmi: selectedEmiIndex !== null ? selectedSku?.emiPlans?.[selectedEmiIndex] : null,
                                    productName: product.name,
                                    productBrand: product.brand
                                }
                            })}
                            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${selectedSku?.stock === 0
                                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                : "bg-black text-white hover:bg-gray-800"
                                }`}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
