import React from "react";

interface ErrorProps {
	message?: string;
	onRetry?: () => void;
}

export function Error({
	message = "Something went wrong",
	onRetry,
}: ErrorProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full space-y-4">
			<div className="text-red-500 text-6xl">⚠️</div>
			<h2 className="text-xl font-semibold text-foreground">Error</h2>
			<p className="text-muted-foreground text-center max-w-md">{message}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
				>
					Try Again
				</button>
			)}
		</div>
	);
}
