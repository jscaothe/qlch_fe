import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IUser, ICreateUserDto, IUpdateUserDto } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";

const userSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  role: z.enum(["admin", "manager", "staff"], {
    required_error: "Vui lòng chọn vai trò",
  }),
  status: z.enum(["active", "inactive"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: IUser;
  onSubmit: (data: ICreateUserDto | IUpdateUserDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          role: initialData.role,
          status: initialData.status,
        }
      : {
          status: "active",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        role: initialData.role,
        status: initialData.status,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        role: undefined,
        status: "active",
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = async (data: UserFormData) => {
    if (loading) return;
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    form.reset();
    onCancel();
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên" {...field} className={form.formState.errors.name ? "border-red-500" : ""} />
                  </FormControl>
                  {form.formState.errors.name && (
                    <FormMessage className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" type="email" {...field} className={form.formState.errors.email ? "border-red-500" : ""} />
                  </FormControl>
                  {form.formState.errors.email && (
                    <FormMessage className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} className={form.formState.errors.phone ? "border-red-500" : ""} />
                  </FormControl>
                  {form.formState.errors.phone && (
                    <FormMessage className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={form.formState.errors.role ? "border-red-500" : ""}>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.role && (
                    <FormMessage className="text-red-500 text-sm mt-1">{form.formState.errors.role.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={form.formState.errors.status ? "border-red-500" : ""}>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.status && (
                    <FormMessage className="text-red-500 text-sm mt-1">{form.formState.errors.status.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {!initialData && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className={form.formState.errors.password ? "border-red-500" : ""} />
                    </FormControl>
                    {form.formState.errors.password && (
                      <FormMessage className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button 
              type="submit"
              disabled={loading || !form.formState.isDirty || !form.formState.isValid}
            >
              {loading ? "Đang xử lý..." : (initialData ? "Cập nhật" : "Thêm mới")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default UserForm; 