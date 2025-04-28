
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FetchmanShiftPlan } from "@/utils/fetchmanCalculator";

interface FetchmanShiftPlanTableProps {
  staffingPlan: FetchmanShiftPlan;
}

export default function FetchmanShiftPlanTable({
  staffingPlan,
}: FetchmanShiftPlanTableProps) {
  if (!staffingPlan.isMultiShift) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Shift Planning</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Number of Shifts</TableCell>
            <TableCell>{staffingPlan.shiftsNeeded}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Fetchmen per Shift</TableCell>
            <TableCell>{staffingPlan.fetchmenPerShift}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Fetchmen Needed</TableCell>
            <TableCell>{staffingPlan.totalFetchmen}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Hours per Shift</TableCell>
            <TableCell>{staffingPlan.shiftHours}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
