import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";

const Analytics = () => {
  const lookerStudioLink1 =
    "https://lookerstudio.google.com/embed/reporting/a646be33-ef6a-48c7-85a1-bfe4783dc970/page/4n2YD";
  const lookerStudioLink2 =
    "https://lookerstudio.google.com/embed/reporting/eecec627-8593-4288-957c-d5e7c75c20a6/page/uh2YD";

  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedLink, setSelectedLink] = useState(lookerStudioLink1);

  const handleOpenLink1 = () => {
    setShowDashboard(true);
    setSelectedLink(lookerStudioLink1);
  };

  const handleOpenLink2 = () => {
    setShowDashboard(true);
    setSelectedLink(lookerStudioLink2);
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "2rem" }}
      >
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: "5rem" }}
          onClick={handleOpenLink1}
        >
          Individual Analytics
        </Button>
        <Button variant="contained" color="primary" onClick={handleOpenLink2}>
          Total Team Analytics
        </Button>
      </Grid>
      {showDashboard && (
        <div style={{ width: "100%", height: "calc(100vh - 64px)" }}>
          <iframe
            title="Looker Studio Dashboard"
            src={selectedLink}
            frameBorder="0"
            width="100%"
            height="100%"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Analytics;
