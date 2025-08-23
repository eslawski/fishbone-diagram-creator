import React from "react";
import Generator from "../Generator";


const DiagramPage: React.FC = () => {

  return (
    <div className="diagram-page" style={{display: "grid", gridTemplateColumns: "1fr 2fr"}}>
        <Generator />
        <div>Evan</div>
    </div>
  );
};

export default DiagramPage;
