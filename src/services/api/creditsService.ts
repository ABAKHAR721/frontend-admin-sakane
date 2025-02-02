import axios from "./request";

export const getUserCredits = async () => {
    try {
        const { data } = await axios.get("/credits");
        return data;
    } catch (error) {
        throw error;
    }
};

export const purchaseCredits = async (amount: number) => {
    try {
        const { data } = await axios.post("/credits/purchase", { amount });
        return data;
    } catch (error) {
        throw error;
    }
};

export const getTransactionHistory = async () => {
    try {
        const { data } = await axios.get("/credits/transactions");
        return data;
    } catch (error) {
        throw error;
    }
};
