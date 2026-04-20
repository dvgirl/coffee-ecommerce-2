import {
  BellRing,
  ChartNoAxesCombined,
  CreditCard,
  MessageSquareMore,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";

export const adminOverviewStats = [
  { title: "Gross revenue", value: "$84,320", delta: "+18.4%", tone: "positive", detail: "vs last month", icon: CreditCard },
  { title: "Orders fulfilled", value: "1,284", delta: "+9.2%", tone: "positive", detail: "same period", icon: ShoppingBag },
  { title: "Returning customers", value: "62%", delta: "+4.8%", tone: "positive", detail: "retention rate", icon: Users },
  { title: "Inventory health", value: "94%", delta: "-3 lots", tone: "warning", detail: "need reordering", icon: PackageCheck },
];

export const revenueSeries = [
  { label: "Mon", amount: 9200 },
  { label: "Tue", amount: 10800 },
  { label: "Wed", amount: 12400 },
  { label: "Thu", amount: 11900 },
  { label: "Fri", amount: 14300 },
  { label: "Sat", amount: 15700 },
  { label: "Sun", amount: 10020 },
];

export const channelPerformance = [
  { name: "Direct", share: 42, revenue: "$35.4k", trend: "+12%" },
  { name: "Instagram", share: 23, revenue: "$19.1k", trend: "+18%" },
  { name: "Email", share: 19, revenue: "$16.0k", trend: "+9%" },
  { name: "Wholesale", share: 16, revenue: "$13.8k", trend: "+6%" },
];

export const fulfillmentQueue = [
  { code: "ORD-2048", customer: "Aarav Mehta", items: "Midnight Onyx x2, French Press", total: "$78.00", status: "Packing", eta: "Pickup in 45 min" },
  { code: "ORD-2047", customer: "Maya Singh", items: "Kenya AA x1, Saffron Sparks x1", total: "$84.00", status: "Ready", eta: "Dispatch at 2:30 PM" },
  { code: "ORD-2046", customer: "Rohan Kapoor", items: "Aura Club subscription renewal", total: "$49.00", status: "Label created", eta: "Courier booked" },
  { code: "ORD-2045", customer: "Elena Brooks", items: "Imperial Matcha x2", total: "$90.00", status: "Attention", eta: "Address verification required" },
];

export const productInventory = [
  { name: "Midnight Onyx", sku: "AUR-COF-001", category: "Coffee", stock: 128, sellThrough: "74%", status: "Healthy", nextBatch: "Apr 15" },
  { name: "Kenya AA", sku: "AUR-COF-006", category: "Coffee", stock: 34, sellThrough: "89%", status: "Low", nextBatch: "Apr 11" },
  { name: "Imperial Matcha Grade A", sku: "AUR-TEA-011", category: "Tea", stock: 52, sellThrough: "68%", status: "Healthy", nextBatch: "Apr 19" },
  { name: "Kashmiri Saffron Sparks", sku: "AUR-SPC-018", category: "Spices", stock: 9, sellThrough: "93%", status: "Critical", nextBatch: "Apr 10" },
  { name: "Roasted Afghan Pistachios", sku: "AUR-DRY-014", category: "Dryfruit", stock: 61, sellThrough: "57%", status: "Healthy", nextBatch: "Apr 18" },
];

export const customerSegments = [
  { name: "Club members", size: "482", spend: "$124 avg", loyalty: "High", note: "Most responsive to monthly curation drops." },
  { name: "Gift buyers", size: "214", spend: "$89 avg", loyalty: "Medium", note: "Peak during launches and festive bundles." },
  { name: "Wholesale partners", size: "36", spend: "$1.8k avg", loyalty: "High", note: "Stable reorder cadence every 12-16 days." },
];

export const teamTasks = [
  { title: "Approve Kenya AA replenishment", owner: "Ops", due: "Today", priority: "High" },
  { title: "Review spring campaign creative", owner: "Marketing", due: "Tomorrow", priority: "Medium" },
  { title: "Verify COD exceptions", owner: "Support", due: "Today", priority: "High" },
  { title: "Refresh SKU photography shortlist", owner: "Brand", due: "Apr 12", priority: "Low" },
];

export const activityFeed = [
  { title: "Subscription churn dropped 2.1%", detail: "Retention win after bundle refresh rollout.", icon: ChartNoAxesCombined, time: "14 minutes ago" },
  { title: "15 high-value carts recovered", detail: "Email flow triggered with 11.8% conversion.", icon: BellRing, time: "32 minutes ago" },
  { title: "2FA enabled for admin team", detail: "Security controls upgraded across all operators.", icon: ShieldCheck, time: "1 hour ago" },
  { title: "Customer satisfaction reached 4.8/5", detail: "Support replies under 6 minutes average.", icon: MessageSquareMore, time: "2 hours ago" },
];

export const settingsGroups = [
  {
    title: "Store operations",
    description: "Tax, shipping windows, payment capture, and refunds.",
    items: ["Auto-capture prepaid orders", "Regional shipping cut-off times", "Order risk review thresholds"],
  },
  {
    title: "Customer experience",
    description: "Notifications, loyalty tiers, and support response policies.",
    items: ["Transactional email branding", "VIP customer routing rules", "Review request automation"],
  },
  {
    title: "Security and access",
    description: "Roles, audit logs, and authentication controls.",
    items: ["Role-based dashboard access", "Mandatory two-factor authentication", "Weekly privileged-access audit"],
  },
];
