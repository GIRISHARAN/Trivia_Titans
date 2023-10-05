import React, { useState } from "react";
import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  sendMessage: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: 500,
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    background: "#f2f2f2",
  },
  input: {
    flexGrow: 1,
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}));

const SendMessage = ({ scroll, team_id, game_id, userName }) => {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const user_name = userName;
  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter a valid message");
      return;
    }

    await addDoc(collection(db, "messages"), {
      message: message,
      user_name: user_name,
      createdAt: serverTimestamp(),
      game_id: game_id,
      team_id: team_id,
    });
    setMessage("");

    if (scroll && scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  return (
    <form
      onSubmit={(event) => sendMessage(event)}
      className={classes.sendMessage}
    >
      <TextField
        className={classes.input}
        placeholder="Type a message..."
        variant="outlined"
        size="small"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        type="submit"
        className={classes.button}
        variant="contained"
        color="primary"
      >
        Send
      </Button>
    </form>
  );
};

export default SendMessage;
