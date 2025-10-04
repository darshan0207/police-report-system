"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { userUpdateSchema, UserUpdateFormData } from "@/lib/schemas/user";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
}

interface UsersTableProps {
  users: User[];
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function UsersTable({
  users,
  onUpdated,
  onDeleted,
}: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
    mode: "onChange",
  });

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("role", user.role);
    setValue("password", ""); // Don't pre-fill password for security
    setValue("confirmPassword", "");
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const updateUser = async (data: UserUpdateFormData) => {
    if (!editingUser) return;

    setIsLoading(true);
    try {
      // Remove confirmPassword and only send password if it's changed
      const { confirmPassword, ...updateData } = data;
      const payload = updateData.password
        ? updateData
        : {
            name: updateData.name,
            email: updateData.email,
            role: updateData.role,
          };

      const response = await fetch(`/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      handleDialogClose();
      onUpdated();
      toast.success("યુઝર સફળતાપૂર્વક અપડેટ થયું");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("શું તમે ખરેખર આ યુઝર કાઢી નાખવા માંગો છો??")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      onDeleted();
      toast.success("યુઝર સફળતાપૂર્વક કાઢી નાખ્યું");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const currentPassword = watch("password");

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> પૂરું નામ</TableHead>
            <TableHead>ઈમેલ</TableHead>
            <TableHead>રોલ</TableHead>
            <TableHead>સ્ટેટસ</TableHead>
            <TableHead className="w-32">એકશનસ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role === "admin" ? "એડમિન" : "યુઝર"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.isActive ? "એક્ટિવ" : "ઇનએક્ટિવ"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex">
                  <Dialog
                    open={editDialogOpen && editingUser?._id === user._id}
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>એડિટ યુઝર</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit(updateUser)}
                        className="space-y-4"
                      >
                        <div className="space-y-4">
                          {/* Name Field */}
                          <div>
                            <Label htmlFor="editName" className="mb-2">
                              પૂરું નામ <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="editName"
                              {...register("name")}
                              placeholder="પૂરું નામ દાખલ કરો"
                              disabled={isLoading}
                              className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                              </p>
                            )}
                          </div>

                          {/* Email Field */}
                          <div>
                            <Label htmlFor="editEmail" className="mb-2">
                              ઈમેલ <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="editEmail"
                              type="email"
                              {...register("email")}
                              placeholder="ઈમેલ દાખલ કરો"
                              disabled={isLoading}
                              className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                              </p>
                            )}
                          </div>

                          {/* Role Field */}
                          <div>
                            <Label htmlFor="editRole" className="mb-2">
                              રોલ <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value: "user" | "admin") =>
                                setValue("role", value)
                              }
                              defaultValue={editingUser?.role || "user"}
                              disabled={isLoading}
                            >
                              <SelectTrigger
                                className={errors.role ? "border-red-500" : ""}
                              >
                                <SelectValue placeholder="રોલ પસંદ કરો" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">યુઝર</SelectItem>
                                <SelectItem value="admin">એડમિન</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.role && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.role.message}
                              </p>
                            )}
                          </div>

                          {/* Password Field (Optional for update) */}
                          <div>
                            <Label htmlFor="editPassword" className="mb-2">
                              નવો પાસવર્ડ (વર્તમાન રાખવા માટે ખાલી છોડી દો)
                            </Label>
                            <div className="relative">
                              <Input
                                id="editPassword"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="નવો પાસવર્ડ દાખલ કરો"
                                disabled={isLoading}
                                className={
                                  errors.password
                                    ? "border-red-500 pr-10"
                                    : "pr-10"
                                }
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
                          </div>

                          {/* Confirm Password Field (Only show if password is entered) */}
                          {currentPassword && (
                            <div>
                              <Label
                                htmlFor="editConfirmPassword"
                                className="mb-2"
                              >
                                કન્ફર્મ નવો પાસવર્ડ{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="editConfirmPassword"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  {...register("confirmPassword")}
                                  placeholder="કન્ફર્મ નવો પાસવર્ડ દાખલ કરો"
                                  disabled={isLoading}
                                  className={
                                    errors.confirmPassword
                                      ? "border-red-500 pr-10"
                                      : "pr-10"
                                  }
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
                          )}
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading
                              ? "અપડેટ કરી રહ્યું છે..."
                              : "અપડેટ યુઝર"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleDialogClose}
                            disabled={isLoading}
                          >
                            રદ કરો
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteUser(user._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            હજુ સુધી કોઈ યુઝર બનાવ્યા નથી
          </h3>
        </div>
      )}

      {users.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>કુલ {users.length} યુઝર</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
