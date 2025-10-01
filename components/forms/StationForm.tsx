import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Unit {
  _id: string;
  name: string;
}

interface StationFormProps {
  station: {
    name: string;
    unit: string;
    address: string;
  };
  units: Unit[];
  onSubmit: (e: React.FormEvent) => void;
  onChange: (station: { name: string; unit: string; address: string }) => void;
  submitText: string;
}

export default function StationForm({
  station,
  units,
  onSubmit,
  onChange,
  submitText,
}: StationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="stationName">Station Name</Label>
        <Input
          id="stationName"
          value={station.name}
          onChange={(e) => onChange({ ...station, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Unit (Optional)</Label>
        <Select
          value={station.unit}
          onValueChange={(value) => onChange({ ...station, unit: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit._id} value={unit._id}>
                {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="stationAddress">Address</Label>
        <Input
          id="stationAddress"
          value={station.address}
          onChange={(e) => onChange({ ...station, address: e.target.value })}
        />
      </div>
      <Button type="submit">{submitText}</Button>
    </form>
  );
}
