export const checkAndClearMessages = (username, maxMessages, messages) => {
  const userMessages = messages.filter((message) => message[username]);

  if (userMessages.length > maxMessages) {
    const remainingMessages = messages.filter((message) => !message[username]);
    messages.length = 0;
    messages.push(...remainingMessages);
    console.log(`Cleared messages for user: ${username}`);
  }
  return messages;
};
