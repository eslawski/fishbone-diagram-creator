import React from "react";
import Generator from "../Generator";
import FishboneDiagram from "../FishboneDiagram";


const DiagramPage: React.FC = () => {

  return (
    <div className="diagram-page" style={{display: "grid", gridTemplateColumns: "1fr 2fr", height: "100%", width: "100%"}}>
        <div style={{height: "100%", overflow: "auto"}}>
          <Generator />
        </div>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
          <FishboneDiagram />
        </div>
    </div>
  );
};

export default DiagramPage;
