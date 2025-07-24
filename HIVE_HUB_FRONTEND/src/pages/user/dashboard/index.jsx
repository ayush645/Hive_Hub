import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import {
  TrendingUp,
  ShoppingCart,
  LocalShipping,
  Refresh,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DatePicker } from "antd";
import userService from "../../../services/userService";
const { RangePicker } = DatePicker;

const lineChartColors = [
  { day: "Mo", value1: 15000, value2: 12000 },
  { day: "Tu", value1: 18000, value2: 16000 },
  { day: "We", value1: 12000, value2: 8000 },
  { day: "Th", value1: 25000, value2: 22000 },
  { day: "Fr", value1: 20000, value2: 18000 },
  { day: "Sa", value1: 16000, value2: 14000 },
  { day: "Su", value1: 22000, value2: 19000 },
];

const revenueDataPie = ["#1976d2", "#9c27b0", "#4caf50", "#ff9800"];

const channelDataPie = ["#1976d2", "#424242", "#4caf50"];

const metrics = [
  {
    key: "deliveredOrders",
    title: "Orders Delivered",
    icon: LocalShipping,
    color: "#4caf50",
  },
  {
    key: "failedOrders",
    title: "Failed Orders",
    icon: Refresh,
    color: "#f44336",
  },
  {
    key: "pendingOrders",
    title: "Pending Orders",
    icon: TrendingUp,
    color: "#ff9800",
  },
  {
    key: "totalOrders",
    title: "Total Orders",
    icon: ShoppingCart,
    color: "#1976d2",
  },
];

const financialMetrics = [
  {
    key: "grossSales",
    title: "Gross Sales",
    color: "#4caf50",
  },
  {
    key: "netSales",
    title: "Net Sales",
    color: "#ff9800",
  },
  {
    key: "totalDiscount",
    title: "Total Discount",
    color: "#9c27b0",
  },
];

const UserHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [revenueData, setRevenueData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleChange = (values) => {
    setDates(values);
    if (values && values.length === 2) {
      setStartDate(values[0].format("YYYY-MM-DD"));
      setEndDate(values[1].format("YYYY-MM-DD"));
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const params = new URLSearchParams();
      params.append("startDate", startDate);
      params.append("endDate", endDate);
      const response = await userService.getUserDashboard(params);
      setDashboardData(response);
      setRevenueData(() => {
        return response?.revenueByCategory?.map((item, index) => ({
          name: item?._id,
          value: item?.revenue,
          color: revenueDataPie[index] || "#1976d2",
        }));
      });
      setLineChartData(() => {
        return response?.chartData?.map((item) => ({
          day: item?._id,
          value1: item?.totalDiscount,
          value2: item?.totalOrders,
          value3: item?.totalRevenue,
        }));
      });
      setChannelData(() => {
        return response?.topProducts?.map((item, index) => ({
          name: item?.title,
          value: item?.totalRevenue,
          color: channelDataPie[index] || "#1976d2",
        }));
      });
    };
    fetchDashboardData();
  }, [startDate, endDate]);

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", px: 2 }}>
      <Box mb={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={1}
          borderColor="#e0e0e0"
          py={1}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1em",
                minWidth: isMobile ? "auto" : 100,
              },
            }}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            <Tab label="Orders" />
            <Tab label="Analytics" />
            <Tab label="Products" />
            <Tab label="Cart" />
          </Tabs>
          <RangePicker
            value={dates}
            onChange={handleChange}
            format="YYYY-MM-DD"
            size="large"
            allowClear
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "8px",
            }}
            placeholder={["Start Date", "End Date"]}
          />
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ background: "white" }}>
            <CardContent
              sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight={600}>
                  Weekly Performance
                </Typography>
              </Box>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={
                      lineChartData?.length > 0
                        ? lineChartData
                        : lineChartColors
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#666" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#666" }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value1"
                      stroke="#1976d2"
                      strokeWidth={3}
                      dot={{ fill: "#1976d2", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value2"
                      stroke="#4caf50"
                      strokeWidth={3}
                      dot={{ fill: "#4caf50", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value3"
                      stroke="#ff9800"
                      strokeWidth={3}
                      dot={{ fill: "#ff9800", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2} height="100%">
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  background: "linear-gradient(135deg, #9c27b0, #673ab7)",
                  color: "white",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                    color="white"
                  >
                    Revenue Category
                  </Typography>
                  <Box height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {revenueData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  background: "linear-gradient(135deg, #673ab7, #3f51b5)",
                  color: "white",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={2}
                    color="white"
                  >
                    Top Products
                  </Typography>
                  <Box height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channelData}
                          cx="60%"
                          cy="60%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {channelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {metrics.map((metric, index) => (
          <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <MetricCard
              {...metric}
              value={dashboardData?.summary[metric.key] || 0}
            />
          </Grid>
        ))}

        {financialMetrics.map((metric, index) => (
          <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card elevation={2}>
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  mb={2}
                >
                  {metric.title}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    color: metric.color,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {dashboardData?.summary[metric.key] || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Legend for Charts */}
      <Box mt={2}>
        <Card elevation={1} sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={3}
            flexWrap="wrap"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Legend:
            </Typography>
            <Chip
              size="small"
              label="Primary Revenue"
              sx={{ backgroundColor: "#1976d2", color: "white" }}
            />
            <Chip
              size="small"
              label="Secondary Revenue"
              sx={{ backgroundColor: "#4caf50", color: "white" }}
            />
            <Chip size="small" label="Last Period" variant="outlined" />
          </Stack>
        </Card>
      </Box>
    </Box>
  );
};

export default UserHome;

const MetricCard = ({ title, value, icon: Icon, color, highlight = false }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
        background: highlight
          ? `linear-gradient(135deg, ${color}15, ${color}05)`
          : "white",
        border: highlight ? `1px solid ${color}30` : "none",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          {Icon && <Icon sx={{ color, fontSize: 24, opacity: 0.8 }} />}
        </Box>
        <Typography
          variant="h4"
          fontWeight={700}
          color={highlight ? color : "text.primary"}
          sx={{ letterSpacing: "-0.5px" }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ChartCard = ({ title, children, height = 300 }) => {
  return (
    <Card elevation={2} sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={3} color="white">
          {title}
        </Typography>
        <Box height={height}>{children}</Box>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2, boxShadow: theme.shadows[8] }}>
        <Typography variant="body2" fontWeight={600} mb={1}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};
