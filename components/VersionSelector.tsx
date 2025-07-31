// components/VersionSelector.tsx
import { Select } from "antd";
const { Option } = Select;

export default function VersionSelector({
  versions,
  activeVersionId,
  setActiveVersionId,
}: {
  versions: { id: number }[];
  activeVersionId: number | null;
  setActiveVersionId: (id: number) => void;
}) {
  if (versions.length === 0) return null;

  return (
    <Select
      value={activeVersionId ?? undefined}
      placeholder="Select version"
      onChange={setActiveVersionId}
      size="large"
      style={{ width: 200 }}
      className="version-select-elegant"
    >
      {versions.map((v) => (
        <Option key={v.id} value={v.id}>
          Version {v.id}
        </Option>
      ))}
    </Select>
  );
}
