import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";

interface BlockData {
	content: string;
	isCode: boolean;
}

function parseMarkdownIntoBlocks(markdown: string): BlockData[] {
	const tokens = marked.lexer(markdown);
	return tokens.map((token) => ({
		content: token.raw,
		isCode: token.type === "code",
	}));
}

const MemoizedMarkdownBlock = memo(
	({ content, isCode }: { content: string; isCode: boolean }) => {
		return (
			<div className="">
				{isCode ? (
					<div className="bg-muted-foreground  rounded-md w-full p-4">
						Generating file....
					</div>
				) : (
					<ReactMarkdown>{content}</ReactMarkdown>
				)}
			</div>
		);
	},
	(prevProps, nextProps) => {
		if (prevProps.content !== nextProps.content) return false;
		if (prevProps.isCode !== nextProps.isCode) return false;
		return true;
	}
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
	({ content, id }: { content: string; id: string }) => {
		const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

		return blocks.map((block, index) => (
			<MemoizedMarkdownBlock
				content={block.content}
				isCode={block.isCode}
				key={`${id}-block_${index}`}
			/>
		));
	}
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
