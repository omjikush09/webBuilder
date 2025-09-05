import { useContext } from "react";
import { CodeContext, CodeContextType } from "@/context/CodeContext";

export const useCode = (): CodeContextType => {
	const context = useContext(CodeContext);
	if (context === undefined) {
		throw new Error("useCode must be used within a CodeProvider");
	}
	return context;
};
