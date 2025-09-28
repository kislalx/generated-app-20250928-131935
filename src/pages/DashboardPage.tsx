import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Truck, Users, AlertTriangle } from "lucide-react";
import { motion, Variants, Transition } from "framer-motion";
const kpiData = [
  {
    title: "Total Stock Value",
    value: "$1,250,430",
    icon: DollarSign,
    change: "+2.5%",
    changeType: "increase",
  },
  {
    title: "Items in Stock",
    value: "12,345",
    icon: Package,
    change: "+150 items",
    changeType: "increase",
  },
  {
    title: "Open Service Orders",
    value: "42",
    icon: Truck,
    change: "-3 from yesterday",
    changeType: "decrease",
  },
  {
    title: "Active Users",
    value: "18",
    icon: Users,
    change: "2 new",
    changeType: "increase",
  },
  {
    title: "Low Stock Alerts",
    value: "7",
    icon: AlertTriangle,
    change: "Critical",
    changeType: "alert",
  },
];
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    } as Transition,
  },
};
export function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {kpiData.map((kpi) => (
          <motion.div key={kpi.title} variants={itemVariants}>
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p
                  className={`text-xs ${
                    kpi.changeType === "increase"
                      ? "text-green-500"
                      : kpi.changeType === "decrease"
                      ? "text-red-500"
                      : kpi.changeType === "alert"
                      ? "text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <div className="text-center text-muted-foreground mt-16">
        <p>More dashboard widgets coming soon!</p>
        <p className="text-sm">Built with ❤�� at Cloudflare</p>
      </div>
    </div>
  );
}