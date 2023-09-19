import { Configuration, OpenAIApi } from "openai";
import { checkAndClearMessages } from "../utils/CheckAndClearMessages.js";
import axios from "axios";

const openAIConfig = new Configuration({
  organization: "org-2X7IgOvrKhPctJ5ExxObqG6R",
  apiKey: process.env.OPENAI_KEY,
});
let messages = []; // 初始化一个空数组来存储消息
const openapi = new OpenAIApi(openAIConfig);

export const chatCompletion = async (req, res) => {
  // console.log("messages:", messages);
  try {
    if (req.user.class === 0) {
      throw new Error("请购买付费用户后使用!");
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
    messages = checkAndClearMessages(req.user.username, 20, messages); //控制session长度部分
    res.status(200).json({ text });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      message: err.message,
    });
  }
};
