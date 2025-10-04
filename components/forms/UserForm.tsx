"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { userSchema, UserFormData } from "@/lib/schemas/user";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface UserFormProps {
  onCreated: () => void;
  initialData?: Partial<UserFormData>;
}

export default function UserForm({ onCreated, initialData }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      confirmPassword: "",
      role: initialData?.role || "user",
    },
    mode: "onChange",
  });

  const handleFormSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data;

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      reset();
      onCreated();
      toast.success("યુઝર સફળતાપૂર્વક બનાવવામાં આવ્યો");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const isSubmitDisabled = isSubmitting || isLoading || !isValid;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="md:col-span-2">
          <Label htmlFor="name" className="mb-2">
            પૂરું નામ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="પૂરું નામ દાખલ કરો"
            disabled={isLoading}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="md:col-span-2">
          <Label htmlFor="email" className="mb-2">
            ઈમેલ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="ઈમેલ દાખલ કરો"
            disabled={isLoading}
            className={errors.email ? "border-red-500" : ""}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <Label htmlFor="password" className="mb-2">
            પાસવર્ડ <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="પાસવર્ડ દાખલ કરો"
              disabled={isLoading}
              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            <strong>પાસવર્ડ આવશ્યકતાઓ:</strong> ઓછામાં ઓછા 8 અક્ષરો જેમાં મોટા,
            નાના અને સંખ્યા
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <Label htmlFor="confirmPassword" className="mb-2">
            કન્ફર્મ પાસવર્ડ <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="કન્ફર્મ પાસવર્ડ દાખલ કરો"
              disabled={isLoading}
              className={
                errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
              }
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>
      {/* Role Field */}
      <div className="md:col-span-2">
        <Label htmlFor="role" className="mb-2">
          રોલ <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(value: "user" | "admin") => setValue("role", value)}
          defaultValue={initialData?.role || "user"}
          disabled={isLoading}
        >
          <SelectTrigger className={errors.role ? "border-red-500" : ""}>
            <SelectValue placeholder="રોલ પસંદ કરો" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">યુઝર</SelectItem>
            <SelectItem value="admin">એડમિન</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitDisabled} className="min-w-24">
        {isLoading ? "સબમિટ કરી રહ્યા છીએ..." : "યુઝર ઉમેરો"}
      </Button>
    </form>
  );
}
