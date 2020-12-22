import React from "react";
import styles from "./index.module.css";

interface Props {
  /**
   * Number from 0 - 1
   */
  progress: number;
}

const CircleProgress = ({ progress }: Props) => {
  return (
    <svg viewBox="0 0 36 36" className={styles["circular-chart"]}>
      <path
        className={styles["circle"]}
        strokeDasharray={`${progress * 100}, 100`}
        d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
  );
};

export default CircleProgress;
