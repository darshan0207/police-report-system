"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  arrangementSchema,
  ArrangementFormData,
} from "@/lib/schemas/arrangement";
import { useState } from "react";
import { toast } from "sonner";

interface ArrangementFormProps {
  onCreated: () => void;
  initialData?: Partial<ArrangementFormData>;
}

export default function ArrangementForm({
  onCreated,
  initialData,
}: ArrangementFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ArrangementFormData>({
    resolver: zodResolver(arrangementSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
    mode: "onChange",
  });

  const handleFormSubmit = async (data: ArrangementFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/arrangements", {
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

      toast.success("બંદોબસ્ત સફળતાપૂર્વક બનાવ્યું");
    } catch (error) {
      console.error("Error creating officer:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create officer"
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
            બંદોબસ્તનું નામ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="બંદોબસ્તનું નામ દાખલ કરો"
            disabled={isLoading}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitDisabled} className="min-w-24">
        {isLoading ? "સબમિટ કરી રહ્યા છીએ..." : "બંદોબસ્ત ઉમેરો"}
      </Button>
    </form>
  );
}
