'use client'
import { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStatistics } from '../../../services/api/adminApi';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface StatCard {
  title: string;
  value: number;
  description: string;
}

interface Statistics {
  total_users: number;
  total_leads: number;
  sold_leads: number;
  total_credits: number;
  spent_credits: number;
  leadsData: { name: string; value: number }[];
  creditsData: { name: string; value: number }[];
}

const StatCardComponent = ({ stat }: { stat: StatCard }) => (
  <Paper sx={{ p: 3, height: '100%' }} elevation={3}>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {stat.title}
    </Typography>
    <Typography variant="h4" component="div" fontWeight="bold">
      {stat.value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {stat.description}
    </Typography>
  </Paper>
);

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [stats, setStats] = useState<Statistics | null>(null);
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs().subtract(7, 'day'));
  const [toDate, setToDate] = useState<Dayjs>(dayjs());

  useEffect(() => {
    fetchStats();
  }, [fromDate, toDate]); // ⬅️ Important : only reload when fromDate or toDate change

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await getStatistics({
        from: fromDate.format('YYYY-MM-DD'),
        to: toDate.format('YYYY-MM-DD')
      });
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (event: React.MouseEvent<HTMLElement>, newPeriod: 'week' | 'month' | 'year') => {
    if (newPeriod) {
      setTimeRange(newPeriod);
      const today = dayjs();
      if (newPeriod === 'week') {
        setFromDate(today.subtract(7, 'day'));
        setToDate(today);
      } else if (newPeriod === 'month') {
        setFromDate(today.subtract(1, 'month'));
        setToDate(today);
      } else if (newPeriod === 'year') {
        setFromDate(today.subtract(1, 'year'));
        setToDate(today);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Failed to load statistics</Typography>
      </Box>
    );
  }

  const statCards: StatCard[] = [
    { title: 'Total Users', value: stats.total_users ?? 0, description: `${stats.total_users ?? 0} registered users` },
    { title: 'Total Leads', value: stats.total_leads ?? 0, description: `${stats.sold_leads ?? 0} leads sold` },
    { title: 'Credits Purchased', value: stats.total_credits ?? 0, description: `Total credits bought` },
    { title: 'Credits Spent', value: stats.spent_credits ?? 0, description: `Credits spent on leads` },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with period & manual date selectors */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Statistics
        </Typography>

        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handlePeriodChange}
          size="small"
          color="primary"
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
          <ToggleButton value="year">Year</ToggleButton>
        </ToggleButtonGroup>

        <DatePicker
          label="From"
          value={fromDate}
          onChange={(newValue) => newValue && setFromDate(newValue)}
          slotProps={{ textField: { size: 'small' } }}
        />
        <DatePicker
          label="To"
          value={toDate}
          onChange={(newValue) => newValue && setToDate(newValue)}
          slotProps={{ textField: { size: 'small' } }}
        />
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {statCards.map((stat, index) => (
          <StatCardComponent key={index} stat={stat} />
        ))}
      </Box>

      {/* Graphs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Leads Sold Evolution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.leadsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3f51b5" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Credits Spent Evolution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.creditsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f50057" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}
