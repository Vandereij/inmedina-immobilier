"use client";

import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface GalleryImage {
	url: string;
	alt?: string;
}

interface PropertyGalleryProps {
	images: (GalleryImage | string)[];
	propertyTitle: string;
}

/**
 * PropertyGallery – polished UI/UX (patched)
 *
 * Fixes:
 * 1) Handle cache hits so images don't stay blurred on reload
 * 2) Eager-load first tiles (hero + a few) to avoid stuck blur with lazy
 * 3) Stable keys based on URL to prevent DOM node reuse issues
 * 4) Optional fetchPriority on hero for faster paint
 */
export function PropertyGallery({ images, propertyTitle }: PropertyGalleryProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loaded, setLoaded] = useState<Record<number, boolean>>({});

	// Normalize images to always have url property
	const normalizedImages = useMemo(
		() => images.map((img) => (typeof img === "string" ? { url: img } : img)),
		[images]
	);

	const hasImages = normalizedImages.length > 0;
	const total = normalizedImages.length;

	const openLightbox = useCallback((index: number) => {
		setCurrentIndex(index);
		setLightboxOpen(true);
		document.body.style.overflow = "hidden";
	}, []);

	const closeLightbox = useCallback(() => {
		setLightboxOpen(false);
		document.body.style.overflow = "";
	}, []);

	const goToNext = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % total);
	}, [total]);

	const goToPrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
	}, [total]);

	// Keyboard navigation when lightbox is open
	useEffect(() => {
		if (!lightboxOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeLightbox();
			if (e.key === "ArrowRight") goToNext();
			if (e.key === "ArrowLeft") goToPrevious();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [lightboxOpen, closeLightbox, goToNext, goToPrevious]);

	// Preload adjacent images for faster nav
	useEffect(() => {
		if (!lightboxOpen || total < 2) return;
		const next = new Image();
		next.src = normalizedImages[(currentIndex + 1) % total]?.url || "";
		const prev = new Image();
		prev.src =
			normalizedImages[(currentIndex - 1 + total) % total]?.url || "";
	}, [lightboxOpen, currentIndex, total, normalizedImages]);

	// Touch (swipe) support in lightbox
	const touchStartX = useRef<number | null>(null);
	const onTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};
	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current == null) return;
		const delta = e.changedTouches[0].clientX - touchStartX.current;
		if (Math.abs(delta) > 50) {
			delta < 0 ? goToNext() : goToPrevious();
		}
		touchStartX.current = null;
	};

	if (!hasImages) return null;

	// Decide the list of images to show in grid (first 8) and hero tile
	const visible = normalizedImages.slice(0, 8);
	const remainingCount = total > 8 ? total - 8 : 0;

	return (
		<section aria-label={`${propertyTitle} gallery`} className="mb-12">
			<div className="flex items-baseline justify-between gap-4 mb-4">
				<h2 className="text-2xl md:text-2xl tracking-tight text-gray-900">
					Gallery
					<span className="ml-3 align-middle text-sm font-normal text-gray-500">
						({total} {total === 1 ? "photo" : "photos"})
					</span>
				</h2>
				<Button onClick={() => openLightbox(0)} className="flex items-center gap-2">
					<Maximize2 className="h-4 w-4" />
					Open all
				</Button>
			</div>

			{/* Asymmetric grid: big hero on the left on md+ */}
			<div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
				{/* Hero tile (index 0) */}
				{visible[0] && (
					<GalleryTile
						img={visible[0]}
						index={0}
						onOpen={openLightbox}
						className="col-span-2 md:col-span-3 md:row-span-2 aspect-4/3 md:aspect-3/2"
						badge={`1 / ${total}`}
						loaded={!!loaded[0]}
						setLoaded={(v) => setLoaded((s) => ({ ...s, 0: v }))}
						lazy={false}
					/>
				)}

				{/* Remaining tiles */}
				{visible.slice(1).map((img, i) => {
					const idx = i + 1;
					const isLastVisible = idx === 7 && remainingCount > 0;
					const eager = idx <= 3; // eager-load a few above-the-fold tiles
					return (
						<GalleryTile
							key={img.url ?? idx}
							img={img}
							index={idx}
							onOpen={openLightbox}
							className="col-span-1 md:col-span-3/2 aspect-square"
							overlay={
								isLastVisible ? (
									<div className="absolute inset-0 grid place-items-center bg-black/70">
										<div className="text-white text-center">
											<div className="text-4xl font-light">+{remainingCount}</div>
											<div className="mt-1 text-xs tracking-widest">MORE PHOTOS</div>
										</div>
									</div>
								) : undefined
							}
							loaded={!!loaded[idx]}
							setLoaded={(v) => setLoaded((s) => ({ ...s, [idx]: v }))}
							lazy={!eager}
						/>
					);
				})}
			</div>

			{/* Lightbox */}
			<AnimatePresence>
				{lightboxOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50"
					>
						<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeLightbox} />

						<div
							role="dialog"
							aria-modal="true"
							aria-label="Image lightbox"
							className="absolute inset-0 flex items-center justify-center"
							onTouchStart={onTouchStart}
							onTouchEnd={onTouchEnd}
						>
							{/* Close */}
							<button
								onClick={closeLightbox}
								className="absolute top-4 right-4 rounded-full p-2 text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
								aria-label="Close gallery"
							>
								<X className="h-7 w-7" />
							</button>

							{/* Counter */}
							<div className="absolute top-4 left-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
								{currentIndex + 1} / {total}
							</div>

							{/* Prev */}
							{total > 1 && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										goToPrevious();
									}}
									className="absolute left-2 md:left-4 rounded-full p-2 text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
									aria-label="Previous image"
								>
									<ChevronLeft className="h-10 w-10" />
								</button>
							)}

							{/* Image */}
							<div className="mx-auto max-w-7xl px-6">
								<motion.img
									key={normalizedImages[currentIndex].url}
									initial={{ opacity: 0, scale: 0.98 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.25 }}
									src={normalizedImages[currentIndex].url}
									alt={
										normalizedImages[currentIndex].alt ||
										`${propertyTitle} - Image ${currentIndex + 1}`
									}
									loading="eager"
									className="max-h-[80vh] w-auto rounded-xl shadow-2xl ring-1 ring-white/10"
								/>
							</div>

							{/* Next */}
							{total > 1 && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										goToNext();
									}}
									className="absolute right-2 md:right-4 rounded-full p-2 text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
									aria-label="Next image"
								>
									<ChevronRight className="h-10 w-10" />
								</button>
							)}

							{/* Thumbs */}
							{total > 1 && (
								<div className="absolute bottom-5 left-1/2 -translate-x-1/2 max-w-[85vw]">
									<div className="flex gap-2 overflow-x-auto px-4 py-2">
										{normalizedImages.map((img, i) => (
											<button
												key={img.url ?? i}
												onClick={(e) => {
													e.stopPropagation();
													setCurrentIndex(i);
												}}
												className={`shrink-0 overflow-hidden rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-white/50 ${
													i === currentIndex
														? "border-white scale-105"
														: "border-transparent opacity-70 hover:opacity-100"
												}`}
												aria-label={`Go to image ${i + 1}`}
											>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={img.url}
													alt={img.alt || `Thumbnail ${i + 1}`}
													loading="lazy"
													className="h-16 w-16 object-cover"
												/>
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}

/******************** Helper: GalleryTile ********************/
function GalleryTile({
	img,
	index,
	onOpen,
	className = "",
	overlay,
	badge,
	loaded,
	setLoaded,
	lazy = true,
}: {
	img: GalleryImage;
	index: number;
	onOpen: (index: number) => void;
	className?: string;
	overlay?: React.ReactNode;
	badge?: string;
	loaded: boolean;
	setLoaded: (v: boolean) => void;
	lazy?: boolean;
}) {
	const imgRef = useRef<HTMLImageElement | null>(null);

	// Handle cache hits + attach load/error listeners (guard against loops)
	useEffect(() => {
		// If we already marked this tile loaded, do nothing
		if (loaded) return;

		const el = imgRef.current;
		if (!el) return;

		// If the image is already cached and complete, mark loaded once
		if (el.complete) {
			setLoaded(true);
			return;
		}

		const onLoad = () => setLoaded(true);
		const onError = () => setLoaded(true); // avoid permanent blur on error

		el.addEventListener("load", onLoad);
		el.addEventListener("error", onError);
		return () => {
			el.removeEventListener("load", onLoad);
			el.removeEventListener("error", onError);
		};
	}, [img.url, loaded]);

	return (
		<motion.button
			type="button"
			onClick={() => onOpen(index)}
			whileTap={{ scale: 0.98 }}
			className={
				"group relative block overflow-hidden rounded-lg bg-gray-100 shadow-sm ring-1 ring-gray-200/60 transition focus:outline-none focus:ring-2 focus:ring-gray-400 " +
				className
			}
			aria-label={`Open image ${index + 1}`}
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				ref={imgRef}
				src={img.url}
				alt={img.alt || `Image ${index + 1}`}
				loading={lazy ? "lazy" : "eager"}
				decoding="async"
				{...(index === 0 ? ({ fetchPriority: "high" } as any) : {})}
				className={
					"h-full w-full object-cover transition duration-500 " +
					(loaded ? "blur-0 scale-100" : "blur-sm scale-[1.02]") +
					" group-hover:scale-[1.05]"
				}
			/>

			{/* gradient + icon overlay */}
			<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			<div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
				<Maximize2 className="h-7 w-7 text-white drop-shadow" />
			</div>

			{/* corner badge */}
			{badge && (
				<div className="pointer-events-none absolute left-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-gray-800 backdrop-blur">
					{badge}
				</div>
			)}

			{overlay}
		</motion.button>
	);
}
