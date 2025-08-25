import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };


export function syncScroll(index: number, scrollDivs: HTMLDivElement[]) {
	const source = scrollDivs[index];
	if (!source) return;
	const percent =
		source.scrollWidth > source.clientWidth
			? source.scrollLeft / (source.scrollWidth - source.clientWidth)
			: 0;
	scrollDivs.forEach((el, i) => {
		if (i !== index && el) {
			const maxScroll = el.scrollWidth - el.clientWidth;
			el.scrollLeft = percent * maxScroll;
		}
	});
}