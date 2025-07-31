import { useState } from "react";
import { Tour } from "antd";

export default function PreviewTour({ steps }) {
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
