import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DutyTypeFormProps {
  dutyType: { name: string; description: string };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (dutyType: { name: string; description: string }) => void;
  submitText: string;
}

export default function DutyTypeForm({
  dutyType,
  onSubmit,
  onChange,
  submitText,
}: DutyTypeFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="DutyType">Duty Type</Label>
        <Input
          id="DutyType"
          value={dutyType.name}
          onChange={(e) => onChange({ ...dutyType, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="DutyTypeDesc">Description</Label>
        <Input
          id="DutyTypeDesc"
          value={dutyType.description}
          onChange={(e) =>
            onChange({ ...dutyType, description: e.target.value })
          }
        />
      </div>
      <Button type="submit">{submitText}</Button>
    </form>
  );
}
