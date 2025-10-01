import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UnitFormProps {
  unit: { name: string; type: string };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (unit: { name: string; type: string }) => void;
  submitText: string;
}

export default function UnitForm({
  unit,
  onSubmit,
  onChange,
  submitText,
}: UnitFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="unitName">Unit Name</Label>
        <Input
          id="unitName"
          value={unit.name}
          onChange={(e) => onChange({ ...unit, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="unitType">Type</Label>
        <Input
          id="unitType"
          value={unit.type}
          onChange={(e) => onChange({ ...unit, type: e.target.value })}
        />
      </div>
      <Button type="submit">{submitText}</Button>
    </form>
  );
}
