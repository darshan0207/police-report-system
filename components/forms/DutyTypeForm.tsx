"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { dutyTypeSchema, DutyTypeFormData } from "@/lib/schemas/duty-type";
import { useState } from "react";
import { toast } from "sonner";

interface DutyTypeFormProps {
  onCreated: () => void;
  initialData?: Partial<DutyTypeFormData>;
}

export default function DutyTypeForm({
  onCreated,
  initialData,
}: DutyTypeFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<DutyTypeFormData>({
    resolver: zodResolver(dutyTypeSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
    mode: "onChange",
  });

  const handleFormSubmit = async (data: DutyTypeFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/duty-type", {
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

      toast.success("Duty type created successfully");
    } catch (error) {
      console.error("Error creating duty type:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create duty type"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isSubmitting || isLoading || !isValid;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name" className="mb-2">
            Duty Type <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter duty type"
            disabled={isLoading}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitDisabled} className="min-w-24">
        {isLoading ? "Submitting..." : "Add Duty Type"}
      </Button>
    </form>
  );
}
