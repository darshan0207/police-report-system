import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { unitSchema, UnitFormData } from "@/lib/schemas/unit";
import { useState } from "react";
import { toast } from "sonner";

interface UnitFormProps {
  onCreated: () => void;
  initialData?: Partial<UnitFormData>;
}

export default function UnitForm({ onCreated, initialData }: UnitFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "",
    },
    mode: "onChange",
  });

  const handleFormSubmit = async (data: UnitFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      reset(); // Reset form after successful submission
      onCreated();

      toast.success("Unit created successfully");
    } catch (error) {
      console.error("Error creating unit:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create unit"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isSubmitting || isLoading || !isValid;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="mb-2">
            Unit Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter unit name"
            disabled={isLoading}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="type" className="mb-2">
            Type <span className="text-red-500">*</span>
          </Label>
          <Input
            id="type"
            {...register("type")}
            placeholder="Enter unit type"
            disabled={isLoading}
            className={errors.type ? "border-red-500" : ""}
          />
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitDisabled} className="min-w-24">
        {isLoading ? "Submitting..." : "Add Unit"}
      </Button>
    </form>
  );
}
