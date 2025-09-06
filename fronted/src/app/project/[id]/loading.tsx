import React from "react";
import { Loading as LoadingComponent } from "@/components/Loading";
function Loading() {
	return (
		<div className="h-screen bg-background">
			<LoadingComponent text="Loading project..." size="lg" />
		</div>
	);
}

export default Loading;
