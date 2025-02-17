import { IAgentRuntime, Memory, Provider, State, elizaLogger } from "@elizaos/core";

const getCurrentNews = async (searchTerm: string) => {
    const response = await fetch(`https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_API_KEY}&q=${searchTerm}`);
    const data = await response.json();
    elizaLogger.info("📰 News Provider: Fetched news data", data);

    return data.results
        .slice(0, 3)
        .map((article: any) => {
            const title = article.title || 'No title available';
            const description = article.description || article.content || 'No description available';
            const link = article.link || '';

            return {
                title,
                description: description.slice(0, 500), // Limit description length for clarity
                link,
            };
        });
};

export const newsProvider: Provider = {
    get: async (_runtime: IAgentRuntime, message: Memory, _state?: State) => {
        try {
            elizaLogger.info("🗞️ News Provider: Starting news fetch");
            const searchTerm = message.content.text || "crypto";
            elizaLogger.info(`🔍 News Provider: Searching for term: ${searchTerm}`);

            const newsArticles = await getCurrentNews(searchTerm);
            elizaLogger.info("✅ News Provider: Successfully fetched news");
            elizaLogger.debug("📰 News Content:", newsArticles);

            // Create a more forceful news context that requires direct reference
            const newsContext = `
URGENT NEWS TO DISCUSS:

${newsArticles.map((article, index) => `
[HEADLINE ${index + 1}]: ${article.title}
[DETAILS]: ${article.description}
[SOURCE]: ${article.link}

YOU MUST DISCUSS THIS BY:
- Mentioning specific details from this headline
- Explaining why this news matters
- Sharing your perspective on its implications
`).join('\n')}

STRICT RESPONSE RULES:
1. Your FIRST sentence must reference one of these headlines directly
2. You must include at least one specific detail or quote from the news
3. You must provide analysis or commentary on the news
4. Do not say "according to the news" or similar phrases - speak directly about the events

REMEMBER: You are not acknowledging or introducing news - you are actively discussing it as current events.`;

            return newsContext;
        } catch (error) {
            elizaLogger.error("❌ News Provider Error:", error);
            return "Unable to fetch news at this time.";
        }
    },
};