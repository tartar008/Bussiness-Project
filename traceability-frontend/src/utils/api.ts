const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${API_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...options,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'API Error');
    }

    return res.json();
}
