"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { BaseIcons } from "@/assets/icons/base/Icons";
import { useBusinessCategories, useBusinessStates } from "../api/metadata";

type SelectOption = {
	id: string;
	label: string;
};

const buildSearchHref = (params: { search?: string; category?: string; location?: string }): string => {
	const searchParams = new URLSearchParams();

	if (params.search) searchParams.set("search_text", params.search);
	if (params.category) searchParams.set("category", params.category);
	if (params.location) searchParams.set("location", params.location);

	const queryString = searchParams.toString();
	return queryString ? `/businesses/search?${queryString}` : "/businesses/search";
};

const BusinessSearch = (): JSX.Element => {
	const router = useRouter();
	const [searchText, setSearchText] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(null);
	const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>(null);
	const [categoryOpen, setCategoryOpen] = useState(false);
	const [locationOpen, setLocationOpen] = useState(false);

	const categoryRef = useRef<HTMLDivElement>(null);
	const locationRef = useRef<HTMLDivElement>(null);

	const {
		data: categoriesEnvelope,
		isLoading: categoriesLoading,
		isError: categoriesError,
	} = useBusinessCategories();
	const {
		data: statesEnvelope,
		isLoading: statesLoading,
		isError: statesError,
	} = useBusinessStates();

	const categoryOptions = useMemo<SelectOption[]>(() => {
		const items = categoriesEnvelope?.data ?? [];
		return items.map(item => ({ id: String(item.id), label: item.name }));
	}, [categoriesEnvelope]);

	const locationOptions = useMemo<SelectOption[]>(() => {
		const items = statesEnvelope?.data ?? [];
		return items.map(item => ({ id: item.name, label: item.name }));
	}, [statesEnvelope]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (categoryOpen && categoryRef.current && !categoryRef.current.contains(target)) {
				setCategoryOpen(false);
			}
			if (locationOpen && locationRef.current && !locationRef.current.contains(target)) {
				setLocationOpen(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setCategoryOpen(false);
				setLocationOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [categoryOpen, locationOpen]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const params: { search?: string; category?: string; location?: string } = {};

		const trimmedSearch = searchText.trim();
		if (trimmedSearch) params.search = trimmedSearch;
		if (selectedCategory?.label) params.category = selectedCategory.label;
		if (selectedLocation?.label) params.location = selectedLocation.label;

		const href = buildSearchHref(params);
		router.push(href);
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="w-full rounded-lg bg-white shadow-sm">
				<div className="flex flex-col sm:flex-row">
					<div className="flex flex-col divide-y divide-[#E3E8EF] sm:flex-1 sm:flex-row sm:divide-y-0 sm:divide-x">
						<div className="flex items-center gap-3 px-5 py-4 sm:flex-1">
							<span className="hidden sm:flex">
								<BaseIcons value="search-black" />
							</span>
							<input
								type="text"
								value={searchText}
								onChange={event => setSearchText(event.target.value)}
								placeholder="What are you looking for?"
								className="w-full border-none bg-transparent text-sm font-inter font-normal text-[#0F172B] outline-none placeholder:text-[#0F0F0F] sm:text-base"
								aria-label="Search text"
							/>
						</div>

						<div ref={categoryRef} className="relative">
							<button
								type="button"
								onClick={() => {
									setCategoryOpen(prev => !prev);
									setLocationOpen(false);
								}}
								className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left text-sm text-[#0F172B] sm:w-[220px] sm:text-base"
								aria-haspopup="listbox"
								aria-expanded={categoryOpen}
							>
								<span className="truncate text-[#0F172B]">
									{selectedCategory?.label ?? "Category"}
								</span>
								<motion.span
									animate={{ rotate: categoryOpen ? 180 : 0 }}
									transition={{ duration: 0.2 }}
									className="text-[#6E44FF]"
								>
									<BaseIcons value="arrow-down-primary" />
								</motion.span>
							</button>

							<AnimatePresence>
								{categoryOpen && (
									<motion.ul
										initial={{ opacity: 0, y: -8 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -8 }}
										transition={{ duration: 0.2 }}
										role="listbox"
										className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-[#E3E8EF] bg-white py-2 shadow-lg"
									>
										{categoriesLoading && (
											<li className="px-4 py-2 text-sm text-[#64748B]">Loading categories…</li>
										)}
										{categoriesError && (
											<li className="px-4 py-2 text-sm text-red-500">Unable to load categories</li>
										)}
										{!categoriesLoading && !categoriesError && categoryOptions.length === 0 && (
											<li className="px-4 py-2 text-sm text-[#64748B]">No categories available</li>
										)}
										{!categoriesLoading && !categoriesError &&
											categoryOptions.map(option => (
												<li key={option.id}>
													<button
														type="button"
														role="option"
														className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm sm:text-base ${
															selectedCategory?.id === option.id ? "text-[#6E44FF]" : "text-[#0F172B]"
														} hover:bg-[#F4F3FF]`}
														onClick={() => {
															setSelectedCategory(option);
															setCategoryOpen(false);
														}}
													>
														<span className="truncate">{option.label}</span>
														{selectedCategory?.id === option.id && (
															<BaseIcons value="arrow-right-black" />
														)}
													</button>
												</li>
											))}
									</motion.ul>
								)}
							</AnimatePresence>
						</div>

						<div ref={locationRef} className="relative">
							<button
								type="button"
								onClick={() => {
									setLocationOpen(prev => !prev);
									setCategoryOpen(false);
								}}
								className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left text-sm text-[#0F172B] sm:w-[220px] sm:text-base"
								aria-haspopup="listbox"
								aria-expanded={locationOpen}
							>
								<span className="flex items-center gap-2 truncate text-[#0F172B]">
									<span className="text-[#6E44FF]">
										<BaseIcons value="location-primary" />
									</span>
									<span className="truncate">{selectedLocation?.label ?? "Current location"}</span>
								</span>
								<motion.span
									animate={{ rotate: locationOpen ? 180 : 0 }}
									transition={{ duration: 0.2 }}
									className="text-[#6E44FF]"
								>
									<BaseIcons value="arrow-down-primary" />
								</motion.span>
							</button>

							<AnimatePresence>
								{locationOpen && (
									<motion.ul
										initial={{ opacity: 0, y: -8 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -8 }}
										transition={{ duration: 0.2 }}
										role="listbox"
										className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-[#E3E8EF] bg-white py-2 shadow-lg"
									>
										{statesLoading && (
											<li className="px-4 py-2 text-sm text-[#64748B]">Loading locations…</li>
										)}
										{statesError && (
											<li className="px-4 py-2 text-sm text-red-500">Unable to load locations</li>
										)}
										{!statesLoading && !statesError && locationOptions.length === 0 && (
											<li className="px-4 py-2 text-sm text-[#64748B]">No locations available</li>
										)}
										{!statesLoading && !statesError &&
											locationOptions.map(option => (
												<li key={option.id}>
													<button
														type="button"
														role="option"
														className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm sm:text-base ${
															selectedLocation?.id === option.id ? "text-[#6E44FF]" : "text-[#0F172B]"
														} hover:bg-[#F4F3FF]`}
														onClick={() => {
															setSelectedLocation(option);
															setLocationOpen(false);
														}}
													>
														<span className="truncate">{option.label}</span>
														{selectedLocation?.id === option.id && (
															<BaseIcons value="arrow-right-black" />
														)}
													</button>
												</li>
											))}
									</motion.ul>
								)}
							</AnimatePresence>
						</div>
					</div>

					<button
						type="submit"
						className="flex items-center justify-center gap-2 rounded-b-[32px] bg-[#6E44FF] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#5B36D4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B36D4] sm:rounded-l-none sm:rounded-r-lg sm:rounded-b-none sm:px-8 sm:text-base"
					>
						<BaseIcons value="search-white" />
						Search
					</button>
				</div>
			</div>
		</form>
	);
};

export default BusinessSearch;
