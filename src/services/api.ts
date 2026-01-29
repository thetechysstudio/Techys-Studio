import axios from "axios";
import { useErrorStatus } from "./errorStatus";
import { showToast } from "../components/toast";

const BACKEND_URL = "https://api.shop.drmcetit.com/api"

export interface SizeOption {
    id: string; // Added ID as it likely exists and is needed
    label: string;
    width: string; // Changed from dimensions
    height: string; // Added height
    price: number; // Changed from basePrice
    offer: number; // Changed from discountPercent
    minQuantity: number; // Changed from discountThreshold
}   

export interface TemplateOption {
    id: string;
    sizeId: string;
    title: string;
    image: string;
}

export const fetchSizes = async (planId: string): Promise<SizeOption[]> => {
    console.log(planId);
    // const { errorStatus } = useErrorStatus();
    try {
        const response = await axios.get(`${BACKEND_URL}/size/${planId}/`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        if (!response.data) {
            throw new Error(`Error fetching sizes: ${response.statusText}`);
        }

        const data = response.data;
        return data;
    } catch (error) {
        // console.error('Failed to fetch sizes:', error?.response?.data || error.message || error);
        showToast(error?.response?.data?.error || error.message || error, "alert");
        // errorStatus(error);
        throw error;
    }
};

export const fetchTemplates = async (sizeId: string): Promise<TemplateOption[]> => {
    // const { errorStatus } = useErrorStatus();
    try {
        const response = await axios.get(`${BACKEND_URL}/template/${sizeId}/`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        if (!response.data) {
            throw new Error(`Error fetching templates: ${response.statusText}`);
        }

        const data = response.data;
        // Wrap in array if response is single object, as per user request example implying singular but generally lists are expected.
        // However, the user example showed a single object response for `template:sizeId`. 
        // If the API returns a SINGLE object for "get template for this size", we might need to handle it.
        // But typically lists are returned. The user said: "response like this {...}". 
        // If it returns one object, we wrap it. If it returns list, we use it.
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        // console.error('Failed to fetch templates:', error?.response?.data || error.message || error);
        showToast(error?.response?.data?.error || error.message || error, "alert");
        // errorStatus(error);
        throw error;
    }
};

export const submitPersonalization = async (formData: FormData): Promise<any> => {
    // const { errorStatus } = useErrorStatus();
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.post(
            `${BACKEND_URL}/personalize/`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );

        localStorage.setItem("order", "srdtfyghjkresdtfghjdfgh");
        showToast("Personalization submitted successfully", "success");
        return response.data;

    } catch (error: any) {
        // console.error(
        //     "Failed to submit personalization:",
        //     error?.response?.data || error.message || error
        // );
        showToast(error?.response?.data?.error || error.message || error, "alert");
        // errorStatus(error);
        throw error;
    }
};
