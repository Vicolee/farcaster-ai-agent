import { State } from "@elizaos/core";
import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    type Action,
} from "@elizaos/core";

const getCurrentNews = async (searchTerm: string) => {
    const response = await fetch(`https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_API_KEY}&q=${searchTerm}`);
    const data = await response.json();
    return data.articles.slice(0, 5).map((article: any) => `${article.title}\n${article.description}\n${article.link}\n${article.content.slice(0, 1000)}`).join("\n\n");
}

export const newsAction: Action = {
    name: "NEWS",
    similes: [
        "GET_NEWS",
        "FETCH_NEWS",
        "CHECK_NEWS",
        "NEWS_UPDATE",
        "NEWS_CHECK",
        "CRYPTO_NEWS",
        "NEWS_REPORT",
        "LATEST_NEWS",
        "CURRENT_NEWS"
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: "Fetches latest news articles based on search terms",
    handler: async (
        _runtime: IAgentRuntime,
        message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        console.log('NEWS action triggered');
        console.log('Message:', message);

        try {
            const searchTerm = message.content.text || "crypto";
            console.log('Using search term:', searchTerm);

            const currentNews = await getCurrentNews(searchTerm);
            console.log('News fetched successfully');

            _callback({
                text: currentNews,
                action: "NEWS"
            });

            return true;
        } catch (error) {
            console.error('Error in NEWS action:', error);
            throw error;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What's the latest crypto news?" },
            },
            {
                user: "{{user2}}",
                content: { text: "Let me check the latest crypto headlines for you", action: "NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "Can you tell me what's happening in crypto?" },
            },
            {
                user: "{{user2}}",
                content: { text: "I'll fetch the most recent crypto news updates", action: "NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "Give me the crypto news headlines" },
            },
            {
                user: "{{user2}}",
                content: { text: "Here are the latest crypto headlines", action: "NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "What's new in crypto today?" },
            },
            {
                user: "{{user2}}",
                content: { text: "I'll get you today's crypto news", action: "NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "Update me on crypto news" },
            },
            {
                user: "{{user2}}",
                content: { text: "Let me fetch the current crypto news for you", action: "NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "Any big crypto news today?" },
            },
            {
                user: "{{user2}}",
                content: { text: "I'll check the latest crypto developments", action: "NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "What's happening in the crypto world?" },
            },
            {
                user: "{{user2}}",
                content: { text: "Let me get you up to speed on crypto news", action: "NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "Tell me the crypto news" },
            },
            {
                user: "{{user2}}",
                content: { text: "I'll share the latest crypto news with you", action: "NEWS" },
            },
        ],
    ] as ActionExample[][],
} as Action;
