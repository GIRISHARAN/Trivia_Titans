import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  chatBox: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(1),
    width: 400,
    borderRadius: theme.spacing(1),
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    background: "#fff",
  },
  messagesWrapper: {
    width: "100%",
    height: 300,
    overflowY: "auto",
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    background: "#f2f2f2",
  },
}));

const ChatBox = ({ teamId, gameId, userName }) => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const scroll = useRef();
  console.log(teamId);
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("team_id", "==", teamId),
      where("game_id", "==", gameId),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll to the last message when messages change
    if (scroll && scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <Box className={classes.chatBox}>
      <Box className={classes.messagesWrapper}>
        {messages?.map((message) => (
          <Message key={message.id} message={message} userName={userName} />
        ))}
        <span ref={scroll}></span>
      </Box>
      <SendMessage
        scroll={scroll}
        game_id={gameId}
        team_id={teamId}
        userName={userName}
      />
    </Box>
  );
};

export default ChatBox;
