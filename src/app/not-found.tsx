import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-max flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-ash">
        That page does not exist. Head back to the shop and keep moving.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-ember px-6 py-3 text-sm rounded-full">
          Home
        </Link>
        <Link href="/shop" className="btn btn-outline px-6 py-3 text-sm rounded-full">
          Shop
        </Link>
      </div>
    </div>
  );
}
