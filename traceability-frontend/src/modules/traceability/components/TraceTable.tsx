export function TraceTable({ items }: { items: any[] }) {
    return (
        <table className="table-auto w-full border">
            <thead>
                <tr>
                    <th className="border px-2">ID</th>
                    <th className="border px-2">Product</th>
                    <th className="border px-2">Date</th>
                </tr>
            </thead>
            <tbody>
                {items.map((i) => (
                    <tr key={i.id}>
                        <td className="border px-2">{i.id}</td>
                        <td className="border px-2">{i.product}</td>
                        <td className="border px-2">{i.date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
