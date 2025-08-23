import React from "react";
import Generator from "../Generator";


const DiagramPage: React.FC = () => {

  return (
    <div className="diagram-page" style={{display: "grid", gridTemplateColumns: "1fr 2fr"}}>
        <Generator />
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>Diagram here soon</div>
    </div>
  );
};

export default DiagramPage;
