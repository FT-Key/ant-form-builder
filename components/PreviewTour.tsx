import { useState } from "react";
import { Tour } from "antd";
import type { TourProps } from "antd";

type StepType = TourProps["steps"];

interface PreviewTourProps {
  steps: StepType;
}

export default function PreviewTour({ steps }: PreviewTourProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);

  return (
    <Tour
      open={open}
      steps={steps}
      current={current}
      onClose={() => setOpen(false)}
      onFinish={() => setOpen(false)}
      onChange={setCurrent}
    />
  );
}
