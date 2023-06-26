import { Configuration, OpenAIApi } from "openai";

interface PromptData {
  prompt:string;
}
export const openaiSummary = (token: string) => async ({prompt}: PromptData) => {
  const configuration = new Configuration({
    apiKey: token,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 1,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  return response
};
