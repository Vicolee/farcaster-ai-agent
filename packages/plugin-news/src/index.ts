import { Plugin } from "@elizaos/core";
import { newsAction } from "./actions/news.ts";
import { factEvaluator } from "./evaluators/fact.ts";
import { newsProvider } from "./providers/news.ts";
import { timeProvider } from "./providers/time.ts";

export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

export const newsPlugin: Plugin = {
    name: "news",
    description: "Agent news with basic actions and evaluators",
    actions: [
        newsAction,
    ],
    evaluators: [factEvaluator],
    providers: [timeProvider, newsProvider],
};
export default newsPlugin;
