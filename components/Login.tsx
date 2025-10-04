"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, LoginFormData } from "@/lib/schemas/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = useCallback(
    async (data: LoginFormData) => {
      // Basic rate limiting
      if (attempts >= 5) {
        setError("ઘણા બધા નિષ્ફળ પ્રયાસો. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);

          if (newAttempts >= 3) {
            setError("અમાન્ય ઓળખપત્રો. ઘણા બધા પ્રયાસો.");
          } else {
            setError("અમાન્ય ઈમેલ અથવા પાસવર્ડ.");
          }

          setTimeout(() => setFocus("password"), 100);
        } else {
          setAttempts(0); // Reset attempts on success
          const session = await getSession();
          if (session) {
            router.push("/dashboard");
            router.refresh();
          } else {
            setError("Authentication failed");
          }
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("કનેક્શન ભૂલ. કૃપા કરીને ફરી પ્રયાસ કરો.");
        setTimeout(() => setFocus("email"), 100);
      } finally {
        setLoading(false);
      }
    },
    [attempts, router, setFocus]
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Auto-fill demo credentials (development only)
  const fillDemoCredentials = () => {
    if (process.env.NODE_ENV === "development") {
      setValue("email", "admin@example.com");
      setValue("password", "password");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="mb-2">
            ઈમેલ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="તમારો ઈમેલ દાખલ કરો"
            className={errors.email ? "border-red-500" : ""}
            {...register("email")}
            disabled={loading}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              પાસવર્ડ <span className="text-red-500">*</span>
            </Label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="તમારો પાસવર્ડ દાખલ કરો"
            className={errors.password ? "border-red-500" : ""}
            {...register("password")}
            disabled={loading}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loading || !isValid}
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            સાઇન ઇન કરી રહ્યા છીએ...
          </>
        ) : (
          "સાઇન ઇન કરો"
        )}
      </Button>

      {/* Demo Button (development only) */}
      {process.env.NODE_ENV === "development" && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={fillDemoCredentials}
          disabled={loading}
        >
          Fill Demo Credentials
        </Button>
      )}
    </form>
  );
}
