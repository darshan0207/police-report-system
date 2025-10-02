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
      toast.success("User updated successfully");
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
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
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
      toast.success("User deleted successfully");
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32">Actions</TableHead>
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
                  {user.role}
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
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
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
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit(updateUser)}
                        className="space-y-4"
                      >
                        <div className="space-y-4">
                          {/* Name Field */}
                          <div>
                            <Label htmlFor="editName" className="mb-2">
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="editName"
                              {...register("name")}
                              placeholder="Enter full name"
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
                              Email Address{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="editEmail"
                              type="email"
                              {...register("email")}
                              placeholder="Enter email address"
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
                              Role <span className="text-red-500">*</span>
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
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
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
                              New Password (leave blank to keep current)
                            </Label>
                            <div className="relative">
                              <Input
                                id="editPassword"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="Enter new password"
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
                                Confirm New Password{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="editConfirmPassword"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  {...register("confirmPassword")}
                                  placeholder="Confirm new password"
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
                            {isLoading ? "Updating..." : "Update User"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleDialogClose}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteUser(user._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No users found
          </h3>
          <p className="text-sm text-muted-foreground">
            Create your first user to get started
          </p>
        </div>
      )}

      {users.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>
                {users.length} user{users.length !== 1 ? "s" : ""} total
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
