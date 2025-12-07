import axios from "@/core/lib/axios";

export const getTraceList = async () => {
    const res = await axios.get("/trace");
    return res.data;
};
