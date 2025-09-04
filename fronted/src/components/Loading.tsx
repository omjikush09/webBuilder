import React from "react";

interface LoadingProps {
	text?: string;
	size?: "sm" | "md" | "lg";
}

export function Loading({ text = "Loading...", size = "md" }: LoadingProps) {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-8 h-8",
		lg: "w-12 h-12",
	};

	return (
		<div className="flex flex-col items-center justify-center h-full space-y-4">
			<div
				className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-primary`}
			/>
			<p className="text-muted-foreground text-sm">{text}</p>
		</div>
	);
}
