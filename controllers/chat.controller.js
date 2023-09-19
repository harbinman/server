import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const openAIConfig = new Configuration({
  organization: "org-2X7IgOvrKhPctJ5ExxObqG6R",
  apiKey: process.env.OPENAI_KEY,
});
const messages = []; // 初始化一个空数组来存储消息
const openapi = new OpenAIApi(openAIConfig);

export const chatCompletion = async (req, res) => {
  // console.log("messages:", messages);
  try {
    if (req.user.class === 0) {
      throw new Error("请购买付费用户后使用!");
      // res.status(200).json({ text: "请购买付费用户后使用!" });
    }

    const { prompt } = req.body;
    console.log("user:", req.user.username);
    if (prompt) {
      messages.push({ [req.user.username]: { role: "user", content: prompt } });
    }
    //session实现部分
    let filteredMessages = messages
      .filter((message) => {
        const username = Object.keys(message)[0]; // 获取对象的第一个键
        return username === req.user.username;
      })
      .map((message) => {
        const username = Object.keys(message)[0]; // 获取用户名
        const contentObj = message[username]; // 获取后面的内容对象
        return contentObj; // 返回后面的内容对象
      });
    console.log(filteredMessages);
    const answer = await openapi.createChatCompletion({
      // messages: [{ role: "user", content: filteredMessages }],
      messages: filteredMessages,
      model: "gpt-3.5-turbo",
    });

    const text = answer.data.choices[0].message.content;
    // const text = filteredMessages;
    messages.push({
      [req.user.username]: { role: "assistant", content: "text" },
    });

    res.status(200).json({ text });
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
