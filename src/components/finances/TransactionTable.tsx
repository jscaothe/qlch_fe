
import React from "react";
import { formatCurrency } from "@/utils/financeUtils";
import { Badge } from "@/components/ui/badge";
import { getCategoryInfo, TRANSACTION_TYPE_INFO } from "@/utils/financeUtils";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Transaction } from "@/types/finances";

type TransactionTableProps = {
  transactions: Transaction[];
};

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  if (!transactions.length) {
    return (
      <div className="text-center p-6 bg-muted/30 rounded-lg">
        <p>Không có giao dịch nào trong khoảng thời gian này</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ngày</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead className="text-right">Số tiền</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const categoryInfo = getCategoryInfo(transaction.category);
            const typeInfo = TRANSACTION_TYPE_INFO[transaction.type];
            
            return (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Badge className={categoryInfo.className}>
                    {categoryInfo.text}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={typeInfo.className}>
                    {typeInfo.text}
                  </span>
                </TableCell>
                <TableCell className={`text-right font-medium ${
                  transaction.type === "income" 
                    ? "text-emerald-600" 
                    : "text-rose-600"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
