import React from "react";
import Stats from "./Stats";
import Profile from "./Profile";
import { Grid } from "@material-ui/core";
import TeamAffiliation from "./TeamAffiliation";

import Achievement from "./Achievement";
import Lex from "../../Lex";

const ProfileHome = () => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Profile />
      </Grid>
      <Grid item style={{ marginLeft: "15rem", marginRight: "15rem" }}>
        <Stats />
      </Grid>
      <Grid item>
        <Grid container justify="center">
          <Grid
            item
            style={{
              marginLeft: "15rem",
              marginRight: "15rem",
              marginTop: "3%",
            }}
          >
            <TeamAffiliation />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container justify="center">
          <Grid
            item
            style={{
              marginLeft: "15rem",
              marginRight: "15rem",
              marginTop: "3%",
            }}
          >
            <Achievement />
          </Grid>
        </Grid>
      </Grid>

      <Lex />
    </Grid>
  );
};

export default ProfileHome;
