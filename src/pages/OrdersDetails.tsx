import axios from "axios";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useErrorStatus } from "../services/errorStatus";
import { useScrollToTopOnReload } from "../components/reload";

const BACKEND_URL = "https://api.shop.drmcetit.com/api";

// Adjust if your backend serves media from a different host
const MEDIA_BASE = "https://api.shop.drmcetit.com";

type OrderDetailsType = {
    id: number;
    image: string;
    video?: string | null;
    templateUrl?: string | null;

    productTitle: string;
    planTitle: string;
    memoryTitle?: string;
    tagline?: string;
    description?: string;

    quantity: number;
    size?: string;

    originalPrice?: number;
    price?: number;
    offer?: number;
    deliveryCharge?: number;
    totalAmount: number;

    orderCompleted: boolean;

    // Shipping / Address
    userName?: string;
    doorNoAndStreet?: string;
    district?: string;
    city?: string;
    state?: string;
    pincode?: string;

    phone?:string
};

const OrdersDetails: React.FC = () => {
    const [orderDetails, setOrderDetails] = useState<OrderDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [openVideo, setOpenVideo] = useState(false);

    const { errorStatus } = useErrorStatus();
    const { id } = useParams();
    const navigate = useNavigate();

    // Scroll to top on reload
    useScrollToTopOnReload()

    const checkAuth = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) navigate("/login");
    };

    const fetchOrdersDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BACKEND_URL}/order/${id}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            console.log(res.data);
            setOrderDetails(res.data);
        } catch (err: any) {
            console.log(err?.response?.data || err);
            errorStatus(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
        fetchOrdersDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const imageUrl = useMemo(() => {
        if (!orderDetails?.image) return "";
        const img = orderDetails.image;
        if (img.startsWith("http")) return img;
        return `${MEDIA_BASE}${img}`;
    }, [orderDetails]);

    const videoUrl = useMemo(() => {
        if (!orderDetails?.video) return "";
        const v = orderDetails.video;
        if (!v) return "";
        if (v.startsWith("http")) return v;
        return `${MEDIA_BASE}${v}`;
    }, [orderDetails]);

    const money = (n?: number) => `₹${Number(n ?? 0).toFixed(0)}`;

    const templateDownloadUrl =
        orderDetails?.templateUrl
            ? orderDetails.templateUrl.startsWith("http")
                ? orderDetails.templateUrl
                : `${MEDIA_BASE}${orderDetails.templateUrl}`
            : "";

    const handleTemplateDownload = async () => {
        if (!templateDownloadUrl) return;

        const res = await fetch(templateDownloadUrl);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "template";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    };

    const handleInvoice = async (id: string) => {
        try {
            const res = await axios.get(
                `${BACKEND_URL}/invoice/${id}`,
                {
                    responseType: "blob", // 👈 VERY IMPORTANT
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            // Create download URL
            const url = window.URL.createObjectURL(new Blob([res.data]));

            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${id}.pdf`; // file name
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error(err);
            errorStatus(err?.response?.data || err?.response?.error || "Invoice download failed");
        }
    };


    return (

        <Layout>
            {openVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    {/* Modal */}
                    <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                            <h3 className="text-base font-semibold text-gray-900">Your Video</h3>

                            <button
                                onClick={() => setOpenVideo(false)}
                                className="rounded-full cursor-pointer border border-black/10 bg-white px-3 py-1 text-sm hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4">
                            <div className="w-full max-h-[75vh] overflow-hidden rounded-xl border border-black/10 bg-black">
                                <video
                                    className="w-full h-full max-h-[75vh] object-contain"
                                    controls
                                    preload="metadata"
                                    playsInline
                                    controlsList="nodownload"
                                >
                                    <source src={videoUrl} type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto w-full ">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                            Orders
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            View item info, delivery address, and payment summary.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-full cursor-pointer border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => navigate("/orders")}
                            className="rounded-full cursor-pointer bg-gray-900 px-4 py-2 text-sm text-white shadow-sm hover:bg-black transition"
                        >
                            All Orders
                        </button>
                    </div>
                </div>

                {/* Loading / Empty */}
                {loading ? (
                    <div className="mt-6 rounded-lg border border-black/10 bg-white p-8 shadow-sm">
                        <div className="animate-pulse space-y-4">
                            <div className="h-5 w-40 rounded bg-gray-100" />
                            <div className="h-28 w-full rounded-xl bg-gray-100" />
                            <div className="h-4 w-2/3 rounded bg-gray-100" />
                            <div className="h-4 w-1/2 rounded bg-gray-100" />
                        </div>
                    </div>
                ) : !orderDetails ? (
                    <div className="mt-6 rounded-lg border border-black/10 bg-white p-10 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            No order details found
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Please try again or open a different order.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Amazon-ish top status card */}
                        <div className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm">
                            <div className="flex flex-col gap-3 border-b border-black/5 p-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                            Order ID
                                        </p>
                                        <p className="font-medium text-gray-900">#{orderDetails.id}</p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                            Status
                                        </p>
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${orderDetails.orderCompleted
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-amber-200 bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {orderDetails.orderCompleted ? "Completed" : "Pending"}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                            Total
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {money(orderDetails.totalAmount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {/* <button
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition"
                    onClick={() => window.print()}
                  >
                    Print
                  </button> */}
                                    {orderDetails.orderCompleted === true && <button
                                        className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition"
                                        onClick={() => handleInvoice(id)}
                                    >
                                        Invoice
                                    </button>}
                                    <button
                                        className="rounded-full cursor-pointer bg-gray-900 px-4 py-2 text-sm text-white shadow-sm hover:bg-black transition"
                                        onClick={() => window.open("https://ig.me/m/the_techys_studio", "_blank")}
                                    >
                                        Need Help?
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                                    {/* Left: Item card */}
                                    <div className="md:col-span-8">
                                        <div className="rounded-lg border border-black/10 bg-white p-4">
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                                                {/* Image */}
                                                <div className="h-40 w-full overflow-hidden rounded-xl border border-black/10 bg-gray-50 md:h-40 md:w-52">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={orderDetails.productTitle}
                                                            className="h-full w-full object-contain"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                                            This Plan Has No image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1">
                                                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                                                        {orderDetails.productTitle}
                                                    </h2>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {orderDetails.planTitle}
                                                    </p>

                                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                                                        <div className="rounded-xl border border-black/10 bg-white p-3">
                                                            <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                                                Quantity
                                                            </p>
                                                            <p className="mt-1 font-medium text-gray-900">
                                                                {orderDetails.quantity}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-xl border border-black/10 bg-white p-3">
                                                            <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                                                Size
                                                            </p>
                                                            <p className="mt-1 font-medium text-gray-900">
                                                                {orderDetails.size || "—"}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-xl border border-black/10 bg-white p-3">
                                                            <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                                                Offer
                                                            </p>
                                                            <p className="mt-1 font-medium text-gray-900">
                                                                {typeof orderDetails.offer === "number"
                                                                    ? `${orderDetails.offer}%`
                                                                    : "—"}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-xl border border-black/10 bg-white p-3">
                                                            <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                                                Delivery
                                                            </p>
                                                            <p className="mt-1 font-medium text-gray-900">
                                                                {money(orderDetails.deliveryCharge)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {(orderDetails.memoryTitle ||
                                                        orderDetails.tagline ||
                                                        orderDetails.description) && (
                                                            <div className="mt-4 rounded-lg border border-black/10 bg-gray-50 p-4">
                                                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                                                    Personalization
                                                                </p>
                                                                <div className="mt-2 space-y-2 text-sm text-gray-700">
                                                                    {orderDetails.memoryTitle && (
                                                                        <div>
                                                                            <span className="text-gray-500">
                                                                                Memory Title:
                                                                            </span>{" "}
                                                                            <span className="font-medium text-gray-900">
                                                                                {orderDetails.memoryTitle}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {orderDetails.tagline && (
                                                                        <div>
                                                                            <span className="text-gray-500">Tagline:</span>{" "}
                                                                            <span className="font-medium text-gray-900">
                                                                                {orderDetails.tagline}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {orderDetails.description && (
                                                                        <div>
                                                                            <span className="text-gray-500">
                                                                                Description:
                                                                            </span>{" "}
                                                                            <span className="font-medium text-gray-900">
                                                                                {orderDetails.description}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                    {/* Actions */}
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {/* <button
                              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition"
                              onClick={() => alert("Buy again feature")}
                            >
                              Buy again
                            </button> */}
                                                        {/* <button
                              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition"
                              onClick={() => alert("Track package feature")}
                            >
                              Track package
                            </button> */}

                                                        {videoUrl && (
                                                            <button
                                                                onClick={() => setOpenVideo(true)}
                                                                className="rounded-full cursor-pointer bg-gray-900 px-4 py-2 text-sm text-white shadow-sm hover:bg-black transition"
                                                            >
                                                                View Video
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Summary + Address */}
                                    <div className="md:col-span-4 space-y-4">
                                        {/* Payment summary */}
                                        <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                Order Summary
                                            </h3>

                                            <div className="mt-4 space-y-3 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Original price</span>
                                                    <span className="text-gray-900">
                                                        {typeof orderDetails.originalPrice === "number"
                                                            ? money(orderDetails.originalPrice)
                                                            : "—"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Unit Price</span>
                                                    <span className="text-gray-900">
                                                        {typeof orderDetails.price === "number"
                                                            ? money(orderDetails.price)
                                                            : "—"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Delivery</span>
                                                    <span className="text-gray-900">
                                                        {money(orderDetails.deliveryCharge)}
                                                    </span>
                                                </div>

                                                <div className="border-t border-black/10 pt-3 flex items-center justify-between">
                                                    <span className="font-medium text-gray-900">Total</span>
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        {money(orderDetails.totalAmount)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* <button
                        onClick={() => alert("Download invoice feature")}
                        className="mt-4 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 transition"
                      >
                        Download invoice
                      </button> */}
                                        </div>

                                        {/* Address */}
                                        <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                Delivery Address
                                            </h3>

                                            <div className="mt-3 space-y-1 text-sm text-gray-700">
                                                <p className="font-medium text-gray-900">
                                                    {orderDetails.userName || "—"}
                                                </p>
                                                <p>{orderDetails.doorNoAndStreet || "—"}</p>
                                                <p>
                                                    {(orderDetails.district || "—") +
                                                        (orderDetails.city ? `, ${orderDetails.city}` : "")}
                                                </p>
                                                <p>
                                                    {(orderDetails.state || "—") +
                                                        (orderDetails.pincode ? ` - ${orderDetails.pincode}` : "")}
                                                </p>
                                                <p>
                                                    {orderDetails.phone || "—" }
                                                </p>
                                            </div>

                                            {/* <button
                        className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-black transition"
                        onClick={() => alert("Edit address feature")}
                      >
                        Edit address
                      </button> */}

                                            <button
                                                className="mt-2 cursor-pointer w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 transition"
                                                onClick={() => window.open("https://ig.me/m/the_techys_studio", "_blank")}
                                            >
                                                Contact support
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Extra info blocks like Amazon */}
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                    Gift Details
                                </p>
                                <p className="mt-2 text-sm text-gray-700">
                                    This order is a memory gift product. If a template is available,
                                    it will be applied during rendering.
                                </p>
                                <p className="mt-3 text-sm text-gray-900">Template:</p>
                                <div className="mt-1">
                                    {orderDetails?.templateUrl ? (
                                        <button
                                            onClick={() => window.open(templateDownloadUrl, "_blank")}
                                            className="inline-flex w-full items-center rounded-lg border border-black/10 bg-black px-4 py-3 text-center text-sm font-medium text-white shadow-sm cursor-pointer transition"
                                        >
                                            View Template
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled
                                            className="inline-flex cursor-pointer w-full items-center rounded-lg border border-black/10 bg-gray-100 px-4 py-3 text-center text-sm font-medium text-gray-400 cursor-not-allowed"
                                        >
                                            Not set
                                        </button>
                                    )}
                                </div>

                            </div>

                            <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                                    Item Notes
                                </p>
                                <p className="mt-2 text-sm text-gray-700">
                                    City: <span className="text-gray-500">{orderDetails.city || "—"}</span>
                                </p>
                                <p className="mt-1 text-sm text-gray-700">
                                    District:{" "}
                                    <span className="text-gray-500">{orderDetails.district || "—"}</span>
                                </p>
                                <p className="mt-1 text-sm text-gray-700">
                                    State: <span className="text-gray-500">{orderDetails.state || "—"}</span>
                                </p>
                            </div>

                            {/* <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                  Quick Actions
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    className="rounded-lg border border-black/10 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 transition"
                    onClick={() => alert("Share order feature")}
                  >
                    Share order
                  </button>
                  <button
                    className="rounded-lg border border-black/10 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 transition"
                    onClick={() => alert("Raise ticket feature")}
                  >
                    Raise a ticket
                  </button>
                </div>
              </div> */}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default OrdersDetails;
