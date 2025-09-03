import { CodeProvider } from "@/context";

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <CodeProvider>{children}</CodeProvider>;
}
