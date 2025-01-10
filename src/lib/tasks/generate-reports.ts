import {
  calculateEmployeePerformance,
  generatePerformanceReport,
} from "../services/performance";
import { sendPerformanceReport } from "../services/email-templates";
import { getEmployees } from "../actions/employee";
import { format, subMonths } from "date-fns";

export async function generateMonthlyReports() {
  const { data: employees } = await getEmployees();
  const previousMonth = subMonths(new Date(), 1);
  const period = format(previousMonth, "yyyy-MM");

  // Calculate performance for all employees
  await Promise.all(
    employees.map((employee) =>
      calculateEmployeePerformance(employee.id, previousMonth)
    )
  );

  // Generate and send reports
  const performanceData = await generatePerformanceReport(period);

  await Promise.all(
    performanceData.map(({ employee, metrics }) =>
      sendPerformanceReport(employee, { ...metrics, period })
    )
  );

  return {
    period,
    employeeCount: employees.length,
    reportsSent: performanceData.length,
  };
}
