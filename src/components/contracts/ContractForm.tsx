
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogFooter } from "@/components/ui/dialog";

// Định nghĩa schema validation
const contractSchema = z.object({
  tenantId: z.string().min(1, "Vui lòng chọn khách thuê"),
  roomId: z.string().min(1, "Vui lòng chọn phòng"),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  monthlyRent: z.string().min(1, "Vui lòng nhập tiền thuê hàng tháng"),
  deposit: z.string().min(1, "Vui lòng nhập tiền đặt cọc"),
  paymentDate: z.string().min(1, "Vui lòng chọn ngày thanh toán"),
  notes: z.string().optional(),
});

type ContractFormProps = {
  onSubmit: () => void;
};

const ContractForm = ({ onSubmit }: ContractFormProps) => {
  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      tenantId: "",
      roomId: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      deposit: "",
      paymentDate: "",
      notes: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof contractSchema>) => {
    console.log(values);
    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Khách thuê</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    {...field}
                  >
                    <option value="" disabled>Chọn khách thuê</option>
                    <option value="1">Nguyễn Văn A</option>
                    <option value="2">Trần Thị B</option>
                    <option value="3">Lê Văn C</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    {...field}
                  >
                    <option value="" disabled>Chọn phòng</option>
                    <option value="1">Phòng 101</option>
                    <option value="2">Phòng 102</option>
                    <option value="3">Phòng 103</option>
                    <option value="4">Phòng 201</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthlyRent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiền thuê hàng tháng (VNĐ)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiền đặt cọc (VNĐ)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày thanh toán hàng tháng</FormLabel>
              <FormControl>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                  {...field}
                >
                  <option value="" disabled>Chọn ngày thanh toán</option>
                  <option value="1">Ngày 1</option>
                  <option value="5">Ngày 5</option>
                  <option value="10">Ngày 10</option>
                  <option value="15">Ngày 15</option>
                  <option value="20">Ngày 20</option>
                  <option value="25">Ngày 25</option>
                  <option value="endOfMonth">Cuối tháng</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Tạo hợp đồng</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ContractForm;
