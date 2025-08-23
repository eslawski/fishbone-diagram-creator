import React, { useState, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from '../hooks'


import CauseCollapse from "./CauseCollapse";

const Generator: React.FC = () => {

  // The `state` arg is correctly typed as `RootState` already
  const causes = useAppSelector((state) => state.fishbone.causes)
  // const dispatch = useAppDispatch()

  return (
    <div>
      {causes && causes.map((cause) => (
        <CauseCollapse key={cause.id} cause={cause} />
      ))}
    </div>
  );
};

export default Generator;
