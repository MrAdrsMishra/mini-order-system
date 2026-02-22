import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


const api = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`
})
export type ProductListItem = {
    productId: string;
    name: string;
    brand: string;
    defaultSkuId: string;
    defaultImage: string;
    price: number;
    maxDiscountPercent: number;
    availableColors: string[];
    availableStorages: string[];
};

export type EmiPlanType = {
    emiPlanId: string;
    lender: string;
    months: number;
    roi: number;
    cashback: number | null;
};

export type SkuType = {
    skuId: string;
    storage: string;
    color: string;
    finish: string | null;
    price: number;
    stock: number;
    images: string[];
    emiPlans: EmiPlanType[];
    paymentOptions: string[];
};

export type ProductDetail = {
    productId: string;
    name: string;
    brand: string;
    description: string | null;
    processor: string | null;
    battery: string | null;
    charging: string | null;
    networks: string | null;
    camera: string | null;
    display: string | null;
    sound: string | null;
    skus: SkuType[];
};

export type CreateEmiPlanType = {
    lender: string; // Name of the lender
    months: number;
    roi: number;
    cashback: number;
};

export type CreateSkuType = {
    storage: string;
    color: string;
    finish: string;
    price: number;
    stock: number;
    images: string[];
    emiPlans: CreateEmiPlanType[];
    paymentOptions: string[]; // List of payment option names
};

export type createProductType = {
    name: string;
    brand: string;
    slug: string;
    description: string | null;
    processor: string | null;
    battery: string | null;
    charging: string | null;
    networks: string | null;
    camera: string | null;
    display: string | null;
    sound: string | null;
    attributes: {
        name: string;
        values: string[];
    }[];
    skus: CreateSkuType[];
};

interface ProductData {
    loading: boolean;
    error: string;
    productList: ProductListItem[];
    productDetails: Record<string, ProductDetail>;
}

interface ProductActions {
    addProduct: (product: createProductType) => Promise<any>;
    loadProductList: () => Promise<void>;
    loadProductDetails: (id: string) => Promise<void>;
    loadEmiBySku: (skuId: string, productId: string) => Promise<void>;
    clearError: () => void;
}

export type ProductState = ProductData & ProductActions;

const addProduct = (set: any, get: any) => async (product: createProductType) => {
    try {
        set({
            loading: true,
            error: ""
        })
        const response = await api.post("/products/add-product", product);
        set({
            loading: false,
        })
        return response.data;
    } catch (error: any) {
        set({
            loading: false,
            error: error.message
        })
        throw error;
    }
}
/* ---------------- LIST PAGE ---------------- */

const loadProductList = (set: any, get: any) => async () => {
    try {
        set({ loading: true });

        const res = await api.get("/products");

        set({
            productList: res.data,
            loading: false,
        });
    } catch (err: any) {
        set({ error: err.message, loading: false });
    }
}

/* ---------------- PRODUCT DETAIL ---------------- */

const loadProductDetails = (set: any, get: any) => async (id: string) => {
    try {
        set({ loading: true });

        const res = await api.get(`/products/${id}`);

        set((state: ProductState) => ({
            loading: false,
            productDetails: {
                ...state.productDetails,
                [id]: res.data,
            },
        }));
    } catch (err: any) {
        set({ error: err.message, loading: false });
    }
}

/* ---------------- EMI BY SKU ---------------- */

const loadEmiBySku = (set: any, get: any) => async (skuId: string, productId: string) => {
    try {
        const res = await api.get(`/emi-plan/${skuId}`);

        set((state: ProductState) => {
            const product = state.productDetails[productId];
            if (!product) return state;

            return {
                productDetails: {
                    ...state.productDetails,
                    [productId]: {
                        ...product,
                        skus: product.skus.map((sku) =>
                            sku.skuId === skuId
                                ? {
                                    ...sku,
                                    emiPlans: res.data.map((e: any) => ({
                                        lender: e.lender?.name || 'Unknown',
                                        months: e.months,
                                        roi: Number(e.roi),
                                        cashback: Number(e.cashback)
                                    }))
                                }
                                : sku
                        ),
                    },
                },
            };
        });
    } catch (err: any) {
        set({ error: err.message });
    }
}
const clearError = (set: any, get: any) => () => {
    set({ error: "" });
}
const initialState: ProductData = {
    loading: false,
    error: "",
    productList: [],
    productDetails: {},
}
export const useProductManagerStore = create<ProductState>()(
    persist(
        (set, get) => ({
            ...initialState,
            addProduct: addProduct(set, get),
            loadProductList: loadProductList(set, get),
            loadProductDetails: loadProductDetails(set, get),
            loadEmiBySku: loadEmiBySku(set, get),
            clearError: clearError(set, get),
        }),
        {
            name: "product-manager",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
