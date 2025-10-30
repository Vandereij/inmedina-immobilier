import Header from "@/components/header";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-h-screen flex flex-col">
				<Header></Header>
				<main className="flex-1 container mx-auto p-4">{children}</main>
				<footer className="p-4 border-t text-sm text-center">
					© {new Date().getFullYear()} RealEstate
				</footer>
			</body>
		</html>
	);
}
