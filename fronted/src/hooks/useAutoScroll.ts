import { useRef, useEffect } from "react";

interface UseAutoScrollOptions {
	threshold?: number;
	scrollDelay?: number;
}

export const useAutoScroll = (options: UseAutoScrollOptions = {}) => {
	const { threshold = 100, scrollDelay = 150 } = options;

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const isUserScrolling = useRef(false);
	const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

	// Check if user is near bottom of scroll
	const isNearBottom = () => {
		if (!messagesContainerRef.current) return true;

		const { scrollTop, scrollHeight, clientHeight } =
			messagesContainerRef.current;
		return scrollHeight - scrollTop - clientHeight < threshold;
	};

	// Auto-scroll to bottom when messages change (only if user is not scrolling)
	const scrollToBottom = () => {
		if (messagesEndRef.current && !isUserScrolling.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	// Handle scroll events to detect user scrolling
	const handleScroll = () => {
		if (!messagesContainerRef.current) return;

		// Mark that user is actively scrolling
		isUserScrolling.current = true;

		// Clear existing timeout
		if (scrollTimeout.current) {
			clearTimeout(scrollTimeout.current);
		}

		// Set timeout to detect when user stops scrolling
		scrollTimeout.current = setTimeout(() => {
			// If user is near bottom, they're likely reading new messages
			// If they scroll up, they're reading older messages
			isUserScrolling.current = !isNearBottom();
		}, scrollDelay);
	};

	// Add scroll event listener
	useEffect(() => {
		const container = messagesContainerRef.current;
		if (container) {
			container.addEventListener("scroll", handleScroll);
			return () => {
				container.removeEventListener("scroll", handleScroll);
				if (scrollTimeout.current) {
					clearTimeout(scrollTimeout.current);
				}
			};
		}
	}, [scrollDelay]);

	return {
		messagesEndRef,
		messagesContainerRef,
		scrollToBottom,
		isUserScrolling: isUserScrolling.current,
	};
};
