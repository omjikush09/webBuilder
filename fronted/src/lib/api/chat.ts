// Chat API functions
// Note: Chat functionality is handled by the useChat hook from @ai-sdk/react
// This file is for any additional chat-related API calls if needed

export const getChatEndpoint = () => {
	return `${process.env.NEXT_PUBLIC_API_URL}/chat`;
};
