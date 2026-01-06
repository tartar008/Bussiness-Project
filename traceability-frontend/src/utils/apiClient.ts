export type QueryParams = Record<string, string | number | undefined>;

export const apiClient = async <T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    query?: QueryParams
): Promise<T> => {
    // สร้าง query string
    const queryString = query
        ? "?" +
        Object.entries(query)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&")
        : "";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081"}${endpoint}${queryString}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}` // เพิ่มถ้าต้องมี token
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `API request failed: ${res.status}`);
    }

    // ถ้าไม่มี response body จะ return null
    if (res.status === 204) return null as unknown as T;

    return res.json();
};
