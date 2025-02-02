import axios from "./request";
import { Lead } from "../../types/leads";

export const getAvailableLeads = async () => {
    try {
        const { data } = await axios.get("/leads");
        return data;
    } catch (error) {
        throw error;
    }
};

export const purchaseLead = async (leadId: string) => {
    try {
        const { data } = await axios.post(`/leads/${leadId}/purchase`);
        return data;
    } catch (error) {
        throw error;
    }
};

export const getMyLeads = async () => {
    try {
        const { data } = await axios.get("/my-leads");
        return data;
    } catch (error) {
        throw error;
    }
};
