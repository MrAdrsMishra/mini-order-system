import a from '../assets/image.png'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useProductManagerStore } from '../store/ProductManagerStore'
function ProductMainPage() {
    const navigate = useNavigate()
    const loadProductList = useProductManagerStore((state) => state.loadProductList);
    const productList = useProductManagerStore((state) => state.productList);
    const [showMessage, setShowMessage] = useState(false);
    const [searchParams] = useSearchParams();
    const orderPlaced = searchParams.get("orderPlaced") === "true";

    useEffect(() => {
        if (orderPlaced) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    }, [orderPlaced]);

    useEffect(() => {
        loadProductList();
    }, [loadProductList]);

    const handleProductView = (product_name: string, product_id: string) => {
        // Create a slug from name
        const slug = product_name.toLowerCase().replace(/ /g, "-");
        navigate(`/products/${slug}/${product_id}`)
    }

    return (
        <div className="w-full h-full flex flex-col items-center gap-10">
            <div id="searchbar" className="max-w-2xl m-4 flex justify-evenly gap-2 ">
                <input type="text" placeholder="Search your products here..." className="w-full p-2 border border-gray-200 rounded-xl min-w-3xl" />
                <button
                    onClick={() => navigate('/add-product')}
                    className="p-2 border border-gray-200 rounded-xl w-auto p-1 cursor-pointer hover:outline hover:outline-gray-200 hover:outline-2">Add Product</button>
            </div>
            <div id="products" className="w-full grid grid-cols-5 gap-4 gap-2 px-10">
                {
                    Array.isArray(productList) && productList.map((product) => {
                        return (
                            <div key={product.productId}
                                onClick={() => handleProductView(product.name, product.productId)}
                                className="max-w-52 border border-gray-200 p-2 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                                <img src={product.defaultImage || a} className="h-52 w-full object-contain" alt={product.name} />
                                <h2 className='text-md font-semibold text-gray-800 overflow-hidden whitespace-nowrap text-ellipsis'>
                                    {product.name}
                                </h2>
                                <p className='text-sm text-gray-500'>{product.brand}</p>
                                <p className="mt-1">
                                    <span className="text-green-700 font-bold text-md">-{product.maxDiscountPercent}%</span>
                                    <span className="ml-2 text-lg font-bold">₹{product.price}</span>
                                </p>
                            </div>
                        )
                    })
                }
            </div>
            {showMessage && (
                // make status message coming from top
                <div
                    className={` w-auto h-auto flex items-center gap-2
    fixed top-2 left-1/2 -translate-x-1/2
    bg-neutral-700 text-white
    px-6 py-3 rounded-lg shadow-lg
    transition-transform transition-opacity duration-1000
    ${showMessage
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-20 opacity-0"}
  `}
                >
                    <span>Order placed successfully!</span><span className="text-green-500 h-5 w-5 border rounded-full flex items-center justify-center">✓</span>
                </div>
            )}
        </div>
    )
}
export default ProductMainPage;
