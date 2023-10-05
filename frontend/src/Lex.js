import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import axios from "axios";

const ChatContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "350px",
  position: "fixed",
  bottom: "20px",
  border: "1px solid #0099ff",
  right: "20px",

  borderRadius: "5px",
  boxShadow: "0 0 5px #ccc",
  backgroundColor: "#f0f0f0",
});

const ChatHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 16px",
  backgroundColor: "#0099ff",
  borderBottom: "1px solid #0099ff",
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  cursor: "pointer",
});

const ChatBody = styled("div")({
  padding: "16px",
  maxHeight: "300px",
  minHeight: "300px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#fff",
  flex: 1,
});

const MessageBubble = styled("div")({
  padding: "8px",
  borderRadius: "5px",
  marginBottom: "8px",
  display: "inline-block",
  maxWidth: "70%",
});

const BotMessage = styled(MessageBubble)({
  backgroundColor: "#0099ff",
  color: "#fff",
  alignSelf: "flex-start",
  marginBottom: "4px",
});

const UserMessage = styled(MessageBubble)({
  backgroundColor: "#e0e0e0",
  alignSelf: "flex-end",
  marginBottom: "4px",
});

const ChatInput = styled("div")({
  display: "flex",
  alignItems: "center",
  borderTop: "1px solid #ccc",
  padding: "8px 16px",
  backgroundColor: "#f0f0f0",
});

const Lex = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };
  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userInput, isUserMessage: true },
    ]);
    setUserInput("");

    try {
      const response = await axios.post(
        "https://hh4g1l7yu8.execute-api.us-east-1.amazonaws.com/dev/get-bot-response",
        {
          username: "kaby11",
          text: userInput,
        }
      );
      console.log(response);
      const botResponse = response.data.body.message;
      console.log(botResponse);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, isUserMessage: false },
      ]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader onClick={toggleChat}>
        {isOpen ? <span>&#x25BC;</span> : <span>&#x25B2;</span>}
        Chat with Bot
      </ChatHeader>
      {isOpen && (
        <>
          <ChatBody ref={chatBodyRef}>
            {messages.map((message, index) =>
              message.isUserMessage ? (
                <UserMessage key={index}>{message.text}</UserMessage>
              ) : (
                <BotMessage key={index}>{message.text}</BotMessage>
              )
            )}
          </ChatBody>
          <ChatInput>
            <TextField
              value={userInput}
              onChange={handleUserInput}
              label="Type a message..."
              fullWidth
              variant="outlined"
            />
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Send
            </Button>
          </ChatInput>
        </>
      )}
    </ChatContainer>
  );
};

export default Lex;
