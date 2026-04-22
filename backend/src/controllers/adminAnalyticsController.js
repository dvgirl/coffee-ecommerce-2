const asyncHandler = require("../utils/asyncHandler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getOverviewStats = asyncHandler(async (req, res) => {
  // Get date ranges
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Gross revenue calculation
  const [currentRevenueResult, lastMonthRevenueResult] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: thisMonth }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: lastMonth, $lt: thisMonth }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ])
  ]);

  const currentRevenue = currentRevenueResult[0]?.total || 0;
  const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;
  const revenueDelta = lastMonthRevenue > 0 ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;

  // Orders fulfilled
  const [currentOrdersResult, lastMonthOrdersResult] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: thisMonth }, status: { $in: ["delivered", "completed"] } }),
    Order.countDocuments({ createdAt: { $gte: lastMonth, $lt: thisMonth }, status: { $in: ["delivered", "completed"] } })
  ]);

  const ordersDelta = lastMonthOrdersResult > 0 ? ((currentOrdersResult - lastMonthOrdersResult) / lastMonthOrdersResult * 100) : 0;

  // Returning customers (simplified - users with more than one order)
  const [totalCustomers, returningCustomers] = await Promise.all([
    User.countDocuments(),
    Order.aggregate([
      { $group: { _id: "$userId", orderCount: { $sum: 1 } } },
      { $match: { orderCount: { $gt: 1 } } },
      { $count: "returning" }
    ])
  ]);

  const retentionRate = totalCustomers > 0 ? (returningCustomers[0]?.returning || 0) / totalCustomers * 100 : 0;

  // Inventory health (products with low stock)
  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.countDocuments({ inStock: false });
  const inventoryHealth = totalProducts > 0 ? ((totalProducts - lowStockProducts) / totalProducts * 100) : 100;

  const stats = [
    {
      title: "Gross revenue",
      value: `$${currentRevenue.toLocaleString()}`,
      delta: `${revenueDelta >= 0 ? '+' : ''}${revenueDelta.toFixed(1)}%`,
      tone: revenueDelta >= 0 ? "positive" : "negative",
      detail: "vs last month"
    },
    {
      title: "Orders fulfilled",
      value: currentOrdersResult.toString(),
      delta: `${ordersDelta >= 0 ? '+' : ''}${ordersDelta.toFixed(1)}%`,
      tone: "positive",
      detail: "same period"
    },
    {
      title: "Returning customers",
      value: `${retentionRate.toFixed(0)}%`,
      delta: "+4.8%", // Placeholder - would need historical data
      tone: "positive",
      detail: "retention rate"
    },
    {
      title: "Inventory health",
      value: `${inventoryHealth.toFixed(0)}%`,
      delta: `-${lowStockProducts} lots`,
      tone: inventoryHealth > 80 ? "positive" : "warning",
      detail: "need reordering"
    }
  ];

  res.status(200).json({
    success: true,
    data: stats
  });
});

const getRevenueSeries = asyncHandler(async (req, res) => {
  const days = 7;
  const series = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lt: endOfDay },
          status: { $ne: "cancelled" }
        }
      },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    series.push({
      label: dayName,
      amount: Math.round(result[0]?.total || 0)
    });
  }

  res.status(200).json({
    success: true,
    data: series
  });
});

const getChannelPerformance = asyncHandler(async (req, res) => {
  // This is a simplified version - in a real app you'd track order sources
  // For now, we'll return placeholder data that matches the frontend expectations
  const channels = [
    { name: "Direct", share: 42, revenue: "$35.4k", trend: "+12%" },
    { name: "Instagram", share: 23, revenue: "$19.1k", trend: "+18%" },
    { name: "Email", share: 19, revenue: "$16.0k", trend: "+9%" },
    { name: "Wholesale", share: 16, revenue: "$13.8k", trend: "+6%" },
  ];

  res.status(200).json({
    success: true,
    data: channels
  });
});

const getFulfillmentQueue = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    status: { $in: ["pending", "confirmed", "packing", "ready"] }
  })
  .populate('userId', 'name')
  .sort({ createdAt: -1 })
  .limit(10)
  .lean();

  const queue = orders.map(order => ({
    code: order.orderCode,
    customer: order.shipping?.name || 'Unknown',
    items: order.items.map(item => `${item.name} x${item.quantity}`).join(', '),
    total: `$${order.total.toFixed(2)}`,
    status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    eta: getETA(order.status, order.createdAt)
  }));

  res.status(200).json({
    success: true,
    data: queue
  });
});

const getProductInventory = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .select('name category basePrice inStock rating')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // Generate mock inventory data based on products
  const inventory = products.map((product, index) => ({
    name: product.name,
    sku: `AUR-${product.category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
    category: product.category,
    stock: product.inStock ? Math.floor(Math.random() * 100) + 20 : Math.floor(Math.random() * 20),
    sellThrough: `${Math.floor(Math.random() * 40) + 50}%`,
    status: product.inStock ? (Math.random() > 0.8 ? "Low" : "Healthy") : "Critical",
    nextBatch: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  res.status(200).json({
    success: true,
    data: inventory
  });
});

function getETA(status, createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const hoursSince = (now - created) / (1000 * 60 * 60);

  switch (status.toLowerCase()) {
    case 'pending':
      return 'Processing order';
    case 'confirmed':
      return 'Preparing items';
    case 'packing':
      return `Ready in ${Math.max(1, 2 - Math.floor(hoursSince))} hours`;
    case 'ready':
      return 'Dispatch at 2:30 PM';
    default:
      return 'Processing';
  }
}

module.exports = {
  getOverviewStats,
  getRevenueSeries,
  getChannelPerformance,
  getFulfillmentQueue,
  getProductInventory,
};