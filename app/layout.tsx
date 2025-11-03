import Header from "@/components/header";
import "./globals.css";

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-h-screen flex flex-col">
				<main className="flex flex-1">
					<section className="w-full">
						<Header />
						{children}
					</section>
				</main>
				<footer className="p-4 border-t text-sm text-center">
					© {new Date().getFullYear()} RealEstate
				</footer>
			</body>
		</html>
	);
}
