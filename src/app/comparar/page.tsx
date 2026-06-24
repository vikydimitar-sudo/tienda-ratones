import { Compare } from "@/components/Compare";
import { PRODUCTS } from "@/lib/data";

export const metadata = {
  title: "Comparador — RatónStore",
};

export default function CompararPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Comparador</h1>
      <p className="mb-6 text-slate-400">
        Enfrenta dos o más ratones y compara sus specs lado a lado.
      </p>
      <Compare products={PRODUCTS} />
    </div>
  );
}
