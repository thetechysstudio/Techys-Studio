import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useErrorStatus } from "../services/errorStatus";
import { useScrollToTopOnReload } from "../components/reload";

type OrderItem = {
    id: string;
    image: string;
    productTitle: string;
    planTitle: string;
    quantity: number;
    totalAmount: number;
    orderCompleted: boolean;
};
const BACKEND_URL = "https://api.shop.drmcetit.com/api"

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { errorStatus } = useErrorStatus();
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true); // Added loading state

    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "completed" | "payment-pending">("all");

    // Scroll to top on reload
    useScrollToTopOnReload()

    useEffect(() => {
        const selectedTemplate = localStorage.getItem('selectedTemplate');
        const orderConfirmed = localStorage.getItem('orderConfirmed');
        const order = localStorage.getItem('order');
        const isReload = sessionStorage.getItem('isReload');
        if (selectedTemplate || orderConfirmed || order || isReload) {
            localStorage.removeItem('selectedTemplate');
            localStorage.removeItem('orderConfirmed');
            localStorage.removeItem('order');
            sessionStorage.removeItem('isReload');
        }
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login");
        }
    }


    const fetchOrders = async () => {
        setLoading(true); // Start loading
        try {
            const res = await axios.get(`${BACKEND_URL}/orders/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })
            console.log(res.data)
            setOrders(res.data);
        } catch (err) {
            console.log(err);
            errorStatus(err);
        } finally {
            setLoading(false); // Stop loading
        }
    }

    useEffect(() => {
        checkAuth();
        fetchOrders();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return orders.filter((o) => {
            const matchesQuery =
                !q ||
                o.productTitle.toLowerCase().includes(q) ||
                o.planTitle.toLowerCase().includes(q);

            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "completed"
                        ? o.orderCompleted
                        : filter === "payment-pending" && !o.orderCompleted;

            return matchesQuery && matchesFilter;
        });
    }, [orders, query, filter]);

    const markCompleted = (idx: number) => {
        setOrders((prev) =>
            prev.map((o, i) => (i === idx ? { ...o, orderCompleted: true } : o))
        );
    };

    const currency = (n: number) => `₹${n.toFixed(0)}`;

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* Page Header */}
                <div className="w-full border-b border-black/5">
                    <div className="mx-auto w-full">
                        <h1 className="text-2xl md:text-4xl font-semibold text-gray-900">
                            Your Orders
                        </h1>
                        <p className="mt-2 text-sm md:text-base text-gray-500">
                            Track purchases, reorder favorites, and manage your memory cards.
                        </p>

                        {/* Controls */}
                        <div className="mt-6 mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full md:max-w-md items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm">
                                <svg
                                    className="h-4 w-4 text-gray-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search orders (product or plan)..."
                                    className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`rounded-full px-4 py-2 text-sm border shadow-sm transition ${filter === "all"
                                        ? "border-black/10 bg-gray-900 text-white"
                                        : "border-black/10 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter("completed")}
                                    className={`rounded-full px-4 py-2 text-sm border shadow-sm transition ${filter === "completed"
                                        ? "border-black/10 bg-gray-900 text-white"
                                        : "border-black/10 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Completed
                                </button>
                                <button
                                    onClick={() => setFilter("payment-pending")}
                                    className={`rounded-full px-4 py-2 text-sm border shadow-sm transition ${filter === "payment-pending"
                                        ? "border-black/10 bg-gray-900 text-white"
                                        : "border-black/10 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Payment Pending
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto w-full py-10">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                        <div className="h-24 w-full rounded-lg bg-gray-200 md:h-24 md:w-40" />
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 w-1/4 rounded bg-gray-200" />
                                            <div className="h-6 w-3/4 rounded bg-gray-200" />
                                            <div className="h-4 w-1/2 rounded bg-gray-200" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">
                                No orders found
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Try a different keyword or change the filter.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((order, idx) => (
                                <div
                                    key={`${order.productTitle}-${idx}`}
                                    className="rounded-lg border border-black/10 bg-white shadow-sm"
                                >
                                    {/* Card Top Bar */}
                                    <div className="flex flex-col gap-2 border-b border-black/5 p-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                                    Plan
                                                </p>
                                                <p className="font-medium text-gray-900">
                                                    {order.planTitle}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                                    Quantity
                                                </p>
                                                <p className="font-medium text-gray-900">
                                                    {order.quantity}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                                    Total
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {currency(order.totalAmount)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${order.orderCompleted
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                                    }`}
                                            >
                                                {order.orderCompleted ? "Order Completed" : "Payment Pending"}
                                            </span>

                                            {/* {!order.orderCompleted && (
                                                <button
                                                    onClick={() => markCompleted(idx)}
                                                    className="rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-black transition"
                                                >
                                                    Mark Completed
                                                </button>
                                            )} */}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                                        <div className="h-50 object-contain w-full overflow-hidden rounded-lg border border-black/10 bg-gray-50 md:h-24 md:w-40">
                                            <img
                                                src={`https://api.shop.drmcetit.com/${order.image}`}
                                                alt={order.productTitle}
                                                className="h-full w-full object-contain"
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                                Product
                                            </p>
                                            <h3 className="text-base md:text-lg font-semibold text-gray-900">
                                                {order.productTitle}
                                            </h3>
                                            {/* <p className="mt-1 text-sm text-gray-500">
                                                A physical keepsake that opens a digital surprise when
                                                scanned.
                                            </p> */}

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button className="rounded-full cursor-pointer border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition" onClick={() => navigate(`/orders/${order.id}`)}>
                                                    View details
                                                </button>
                                                {/* <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition">
                                                    Buy again
                                                </button> */}
                                                {/* <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition">
                                                    Invoice
                                                </button> */}
                                                <button
                                                    type="button"
                                                    onClick={() => window.open("https://ig.me/m/the_techys_studio", "_blank")}
                                                    className="rounded-full cursor-pointer border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition"
                                                >
                                                    Need help?
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Small Footer note */}
                    <p className="mt-10 text-center text-xs text-gray-400">
                        Showing {filtered.length} order{filtered.length === 1 ? "" : "s"}.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
