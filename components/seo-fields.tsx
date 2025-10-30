"use client";
export function SeoFields({
	value,
	onChange,
}: {
	value: any;
	onChange: (v: any) => void;
}) {
	return (
		<div className="grid gap-3">
			{[
				"seo_title",
				"seo_description",
				"seo_canonical",
				"seo_robots",
			].map((k) => (
				<div key={k}>
					<label className="block text-sm mb-1">
						{k.replace("seo_", "").toUpperCase()}
					</label>
					<input
						className="w-full border rounded-xl p-2"
						value={value?.[k] || ""}
						onChange={(e) =>
							onChange({ ...value, [k]: e.target.value })
						}
					/>
				</div>
			))}
		</div>
	);
}
