import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductManagerStore, type createProductType } from "../store/ProductManagerStore";

const AddProductPage = () => {
  const navigate = useNavigate();
  const addProduct = useProductManagerStore((state) => state.addProduct);
  const loading = useProductManagerStore((state) => state.loading);
  const error = useProductManagerStore((state) => state.error);

  // Common Details
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [processor, setProcessor] = useState("");
  const [battery, setBattery] = useState("");
  const [charging, setCharging] = useState("");
  const [networks, setNetworks] = useState("");
  const [camera, setCamera] = useState("");
  const [display, setDisplay] = useState("");
  const [sound, setSound] = useState("");

  // Variants (SKUs)
  const [skus, setSkus] = useState<any[]>([
    {
      storage: "",
      color: "",
      finish: "",
      price: "",
      stock: "",
      images: [""],
      emiPlans: [{ lender: "HDFC", months: 6, roi: 12, cashback: 0 }],
      paymentOptions: ["UPI", "Card"]
    }
  ]);

  const handleAddSku = () => {
    setSkus([...skus, {
      storage: "",
      color: "",
      finish: "",
      price: "",
      stock: "",
      images: [""],
      emiPlans: [{ lender: "HDFC", months: 12, roi: 15, cashback: 0 }],
      paymentOptions: ["UPI"]
    }]);
  };

  const handleSkuChange = (index: number, field: string, value: any) => {
    const updated = [...skus];
    updated[index][field] = value;
    setSkus(updated);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract unique colors and storages for attributes
    const colors = Array.from(new Set(skus.map(s => s.color).filter(Boolean)));
    const storages = Array.from(new Set(skus.map(s => s.storage).filter(Boolean)));

    const productData: createProductType = {
      name,
      brand,
      slug: generateSlug(name),
      description,
      processor,
      battery,
      charging,
      networks,
      camera,
      display,
      sound,
      attributes: [
        { name: "Color", values: colors },
        { name: "Storage", values: storages }
      ],
      skus: skus.map((sku) => ({
        ...sku,
        price: Number(sku.price),
        stock: Number(sku.stock),
        emiPlans: sku.emiPlans.map((emi: any) => ({
          ...emi,
          months: Number(emi.months),
          roi: Number(emi.roi),
          cashback: Number(emi.cashback)
        }))
      }))
    };

    try {
      await addProduct(productData);
      navigate("/");
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-12 border-b pb-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">ADD PRODUCT</h1>
          <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest font-bold">Inventory Management System</p>
        </div>
        {loading && (
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full text-blue-600 font-bold text-sm animate-pulse">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
            SAVING SYNC...
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-center gap-3">
          <span className="text-red-500 font-bold text-xl">!</span>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-16">
        {/* STEP 1: COMMON DETAILS */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full font-bold">01</span>
            <h2 className="text-2xl font-bold text-gray-800">Common Specifications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-8 rounded-3xl">
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">General Info</label>
              <input type="text" placeholder="Product Marketing Name" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none transition-all" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="text" placeholder="Brand" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none transition-all" value={brand} onChange={(e) => setBrand(e.target.value)} required />
              <textarea placeholder="Detailed Marketing Description" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm h-32 focus:ring-2 focus:ring-black outline-none transition-all resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Hardware Specs</label>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Processor" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none" value={processor} onChange={(e) => setProcessor(e.target.value)} />
                <input type="text" placeholder="Battery" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none" value={battery} onChange={(e) => setBattery(e.target.value)} />
                <input type="text" placeholder="Display" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none" value={display} onChange={(e) => setDisplay(e.target.value)} />
                <input type="text" placeholder="Sound" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none" value={sound} onChange={(e) => setSound(e.target.value)} />
              </div>
              <input type="text" placeholder="Charging Tech" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none" value={charging} onChange={(e) => setCharging(e.target.value)} />
              <input type="text" placeholder="Networks Support" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none" value={networks} onChange={(e) => setNetworks(e.target.value)} />
              <input type="text" placeholder="Camera System" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none" value={camera} onChange={(e) => setCamera(e.target.value)} />
            </div>
          </div>
        </div>

        {/* STEP 2: VARIANTS */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full font-bold">02</span>
              <h2 className="text-2xl font-bold text-gray-800">Variant Inventory</h2>
            </div>
            <button type="button" onClick={handleAddSku} className="bg-black text-white px-6 py-2 rounded-full font-bold text-xs hover:bg-gray-800 transition-all shadow-lg">+ ADD ANOTHER VARIANT</button>
          </div>

          <div className="space-y-10">
            {skus.map((sku, skuIndex) => (
              <div key={skuIndex} className="bg-gray-50 p-8 rounded-[2rem] border-2 border-transparent hover:border-black transition-all relative group">
                {skus.length > 1 && (
                  <button type="button" onClick={() => setSkus(skus.filter((_, i) => i !== skuIndex))} className="absolute -top-4 -right-4 bg-white border-2 border-black w-10 h-10 rounded-full text-black font-black hover:bg-black hover:text-white transition-all shadow-xl flex items-center justify-center z-10">✕</button>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Core Variant Details</label>
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" placeholder="Color" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" value={sku.color} onChange={(e) => handleSkuChange(skuIndex, "color", e.target.value)} required />
                      <input type="text" placeholder="Storage" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" value={sku.storage} onChange={(e) => handleSkuChange(skuIndex, "storage", e.target.value)} required />
                      <input type="text" placeholder="Finish (e.g. Matte)" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" value={sku.finish} onChange={(e) => handleSkuChange(skuIndex, "finish", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                        <input type="number" placeholder="Price" className="w-full bg-white border-none p-4 pl-8 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none font-bold" value={sku.price} onChange={(e) => handleSkuChange(skuIndex, "price", e.target.value)} required />
                      </div>
                      <input type="number" placeholder="In Stock Count" className="w-full bg-white border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none font-bold" value={sku.stock} onChange={(e) => handleSkuChange(skuIndex, "stock", e.target.value)} required />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Image Assets</label>
                      <div className="space-y-2">
                        {sku.images.map((img: string, imgIdx: number) => (
                          <div key={imgIdx} className="flex gap-2">
                            <input type="text" placeholder="Paste high-res image URL here" className="flex-1 bg-white border-none p-3 rounded-xl text-sm shadow-sm outline-none focus:ring-1 focus:ring-black" value={img} onChange={(e) => {
                              const newImgs = [...sku.images];
                              newImgs[imgIdx] = e.target.value;
                              handleSkuChange(skuIndex, "images", newImgs);
                            }} />
                            {sku.images.length > 1 && (
                              <button type="button" onClick={() => {
                                const newImgs = sku.images.filter((_: any, i: any) => i !== imgIdx);
                                handleSkuChange(skuIndex, "images", newImgs);
                              }} className="bg-white text-red-500 w-10 rounded-xl hover:bg-red-50 flex items-center justify-center">×</button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => handleSkuChange(skuIndex, "images", [...sku.images, ""])} className="text-[10px] font-black uppercase tracking-tighter text-blue-600 hover:text-blue-800 transition-colors">+ ADD IMAGE SLOT</button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Payment & EMI Structure</label>
                    <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm">
                      {sku.emiPlans.map((emi: any, emiIdx: number) => (
                        <div key={emiIdx} className="grid grid-cols-4 gap-3">
                          <input type="text" placeholder="Lender" className="bg-gray-50 border-none p-2 rounded-lg text-xs font-bold outline-none" value={emi.lender} onChange={(e) => {
                            const newPlans = [...sku.emiPlans]; newPlans[emiIdx].lender = e.target.value; handleSkuChange(skuIndex, "emiPlans", newPlans);
                          }} />
                          <input type="number" placeholder="Months" className="bg-gray-50 border-none p-2 rounded-lg text-xs font-bold outline-none" value={emi.months} onChange={(e) => {
                            const newPlans = [...sku.emiPlans]; newPlans[emiIdx].months = e.target.value; handleSkuChange(skuIndex, "emiPlans", newPlans);
                          }} />
                          <input type="number" placeholder="ROI%" className="bg-gray-50 border-none p-2 rounded-lg text-xs font-bold outline-none" value={emi.roi} onChange={(e) => {
                            const newPlans = [...sku.emiPlans]; newPlans[emiIdx].roi = e.target.value; handleSkuChange(skuIndex, "emiPlans", newPlans);
                          }} />
                          <input type="number" placeholder="Cash" className="bg-gray-50 border-none p-2 rounded-lg text-xs font-bold outline-none text-green-600" value={emi.cashback} onChange={(e) => {
                            const newPlans = [...sku.emiPlans]; newPlans[emiIdx].cashback = e.target.value; handleSkuChange(skuIndex, "emiPlans", newPlans);
                          }} />
                        </div>
                      ))}
                      <button type="button" onClick={() => handleSkuChange(skuIndex, "emiPlans", [...sku.emiPlans, { lender: "", months: 12, roi: 15, cashback: 0 }])} className="text-[10px] font-black uppercase tracking-tighter text-blue-600 hover:text-blue-800">+ NEW PLAN</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t">
          <button type="submit" disabled={loading} className={`w - full bg - black text - white text - xl font - black py - 6 rounded - [2rem] shadow - 2xl transition transform active: scale - 95 flex items - center justify - center gap - 4 ${loading ? "opacity-30 cursor-wait" : "hover:bg-gray-900"} `}>
            {loading ? "COMMITTING TO DATABASE..." : "FINALIZE AND CREATE PRODUCT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;