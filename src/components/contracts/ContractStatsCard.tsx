
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract } from "@/types/contracts";
import { calculateTotalMonthlyRent } from "@/utils/contractUtils";

type ContractStatsCardProps = {
  contracts: Contract[];
};

const ContractStatsCard = ({ contracts }: ContractStatsCardProps) => {
  const activeContracts = contracts.filter(c => c.status === "active").length;
  const expiredContracts = contracts.filter(c => c.status === "expired").length;
  const totalMonthlyRent = calculateTotalMonthlyRent(contracts);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thống kê hợp đồng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="dashboard-card p-4 flex flex-col items-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {activeContracts}
            </div>
            <div className="text-sm text-muted-foreground">Hợp đồng đang hiệu lực</div>
          </div>
          <div className="dashboard-card p-4 flex flex-col items-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {expiredContracts}
            </div>
            <div className="text-sm text-muted-foreground">Hợp đồng đã hết hạn</div>
          </div>
          <div className="dashboard-card p-4 flex flex-col items-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {totalMonthlyRent.toLocaleString('vi-VN')} đ
            </div>
            <div className="text-sm text-muted-foreground">Tổng giá trị hợp đồng/tháng</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractStatsCard;
