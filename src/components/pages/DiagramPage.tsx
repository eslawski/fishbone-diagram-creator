import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Generator from "../Generator";
import FishboneDiagram from "../FishboneDiagram";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchDiagram } from "../../slices/fishboneSlice";

const DiagramPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { diagramId } = useParams<{ diagramId: string }>();
    const diagram = useAppSelector(state => state.fishbone.diagram);

    useEffect(() => {
        if (!diagramId) {
            throw Error("Unable to fetch diagram: diagram ID is required");
        }
        
        // Always fetch the diagram when diagramId changes, regardless of status
        dispatch(fetchDiagram({ diagramId: diagramId }));
    }, [dispatch, diagramId]);

    if (!diagram) {
        return <div>Loading...</div>;
    }

    return (
        <div className="diagram-page" style={{display: "grid", gridTemplateColumns: "1fr 2fr", height: "100%", width: "100%"}}>
            <div style={{height: "100%", overflow: "auto", paddingRight: "16px"}}>
                <Generator diagram={diagram} />
            </div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                <FishboneDiagram diagram={diagram} />
            </div>
        </div>
    );
};

export default DiagramPage;
