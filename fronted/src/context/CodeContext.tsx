"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CodeContent {
	html: string;
	css: string;
	js: string;
}

interface CodeContextType {
	code: CodeContent;
	setCode: (newCode: Partial<CodeContent>) => void;
	getCode: (type: keyof CodeContent) => string;
	setCodeByType: (type: keyof CodeContent, content: string) => void;
	clearCode: () => void;
}

const defaultCode: CodeContent = {
	html: "",
	css: "",
	js: "",
};

const CodeContext = createContext<CodeContextType | undefined>(undefined);

interface CodeProviderProps {
	children: ReactNode;
}

export const CodeProvider: React.FC<CodeProviderProps> = ({ children }) => {
	const [code, setCodeState] = useState<CodeContent>(defaultCode);

	const setCode = (newCode: Partial<CodeContent>) => {
		setCodeState((prev) => ({
			...prev,
			...newCode,
		}));
	};

	const getCode = (type: keyof CodeContent): string => {
		return code[type] || "";
	};

	const setCodeByType = (type: keyof CodeContent, content: string) => {
		setCodeState((prev) => ({
			...prev,
			[type]: content,
		}));
	};

	const clearCode = () => {
		setCodeState(defaultCode);
	};

	const value: CodeContextType = {
		code,
		setCode,
		getCode,
		setCodeByType,
		clearCode,
	};

	return <CodeContext.Provider value={value}>{children}</CodeContext.Provider>;
};

export const useCode = (): CodeContextType => {
	const context = useContext(CodeContext);
	if (context === undefined) {
		throw new Error("useCode must be used within a CodeProvider");
	}
	return context;
};
