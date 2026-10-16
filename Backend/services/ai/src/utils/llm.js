import { ChatOpenRouter } from "@langchain/openrouter"

const openRouterllm=new ChatOpenRouter({
    model:"deepseek/deepseek-chat",
    temperature:0,
    maxTokens:1024
})

export default openRouterllm