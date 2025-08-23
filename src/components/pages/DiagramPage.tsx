import React, { useEffect } from "react";
import Generator from "../Generator";
import FishboneDiagram from "../FishboneDiagram";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectDiagramStatus, fetchDiagram } from "../../slices/fishboneSlice";


const DiagramPage: React.FC = () => {
    const dispatch = useAppDispatch();
    // const diagram = useAppSelector(selectDiagram);
    const diagramStatus = useAppSelector(selectDiagramStatus);

    useEffect(() => {
        if (diagramStatus === "idle") {
            dispatch(fetchDiagram({userId: "4bcfb57e-7d27-434d-8c6a-5ce86b5d0aa7", diagramId: "cd52c7e2-0712-4646-9fbb-f3de4b0cc756"}));
        }
    }, [diagramStatus, dispatch]);

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
