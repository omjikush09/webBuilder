"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeTab } from "@/components/CodeTab";
import PreviewTab from "@/components/PreviewTab";

export function MainContent() {
	return (
		<div className="flex-1  rounded-lg bg-background  h-full">
			<Tabs defaultValue="code" className="w-full h-full">
				<TabsList className="grid w-[200px] grid-cols-2 bg-muted-foreground">
					<TabsTrigger value="code">Code</TabsTrigger>
					<TabsTrigger value="preview">Preview</TabsTrigger>
				</TabsList>

				<TabsContent value="code" className="mt-4 h-[calc(100vh-200px)]">
					<CodeTab />
				</TabsContent>

				<TabsContent value="preview" className="mt-4 h-[calc(100vh-200px)]">
					<PreviewTab />
				</TabsContent>
			</Tabs>
		</div>
	);
}
