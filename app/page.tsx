import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { useMemo } from "react";
import SearchBar from "@/components/search-bar";
import Header from "@/components/header";

export default async function HomePage() {
	const supabase = useMemo(() => createClient(), []);
	const { data: locations } = await supabase
		.from("locations")
		.select("*")
		.order("name");
	return (
		<>
			<section className="w-full grid h-fit gap-6  bg-cover bg-center bg-gray-400 bg-blend-multiply bg-[url(https://inmedina.com/wp-content/uploads/2024/03/riad-bamileke-suite-wide-shot.jpg)]">
				<div className="flex justify-center">
					<div className="w-10/12">
						<div className="pt-65 pb-20 text-white">
							<h1 className="text-5xl font-light">
								<span className="uppercase">
									InMedina Immobilier
								</span>
							</h1>
							<h2 className="text-2xl font-normal">
								The Art of Moroccan Living, Refined.
							</h2>
						</div>
						<SearchBar />
						{/* <div className="align-middle text-sm text-gray-600 py-6">
						Or browse all{" "}
						<Link className="underline" href="/properties">
							properties
						</Link>
						.
					</div> */}
					</div>
				</div>
			</section>
			<section className="py-8 flex flex-1 justify-center">
				<div className="w-10/12">
					<h2 className="text-2xl font-semibold">
						Properties for sale
					</h2>
				</div>
			</section>
			<section className="py-8 flex flex-1 justify-center">
				<div className="w-10/12">
					<h2 className="text-2xl font-semibold">
						Properties for rent
					</h2>
				</div>
			</section>
		</>
	);
}
