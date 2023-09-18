import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const openAIConfig = new Configuration({
  organization: "org-2X7IgOvrKhPctJ5ExxObqG6R",
  apiKey: process.env.OPENAI_KEY,
});

const openapi = new OpenAIApi(openAIConfig);

export const chatCompletion = async (req, res) => {
  try {
    if (req.user.class === 0) {
      throw new Error("请购买付费用户后使用!");
      // res.status(200).json({ text: "请购买付费用户后使用!" });
    }
    const { prompt } = req.body;
    console.log(prompt);
    // const answer = await openapi.createChatCompletion({
    //   messages: [{ role: "user", content: prompt }],
    //   model: "gpt-3.5-turbo",
    // });

    // const text = answer.data.choices[0].message.content;

    res.status(200).json({ text: "result" });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      message: err.message,
    });
  }
};

// export const chatCompletion = async (req, res) => {
//   const instance = axios.create({
//     // 代理配置
//     proxy: {
//       host: "127.0.0.1", // 代理服务器的主机名
//       port: 7890, // 代理服务器的端口号
//       protocol: "http", // 代理服务器的协议类型
//     },
//   });

//   const apiKey = process.env.OPENAI_KEY;
//   const { prompt } = req.body;

//   instance
//     .post(
//       "https://api.openai.com/v1/engines/davinci/completions",
//       {
//         prompt,
//         max_tokens: 50,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${apiKey}`,
//         },
//       }
//     )
//     .then((response) => {
//       console.log(response.data.choices[0].text);
//       res.status(200).json({ text: response.data.choices[0].text });
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };
