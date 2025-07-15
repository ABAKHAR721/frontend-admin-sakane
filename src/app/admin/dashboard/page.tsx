'use client'

import { useState, useEffect } from 'react'
import { Box, Paper, Typography, CircularProgress, ToggleButtonGroup, ToggleButton, TextField } from '@mui/material'
import { TrendingUp, Person, Assignment, CreditCard } from '@mui/icons-material'
import { getDashboardToday, getDashboardGraph } from '../../../services/api/adminApi'
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // ✅ Ajout du DatePicker
import dayjs from 'dayjs'; // ✅ Pour bien gérer les dates

interface DashboardData {
  new_leads: number;
  purchased_leads: number;
  credits_purchased: number;
  new_users: number;
}

interface GraphData {
  leads: number[];
  credits: number[];
  labels: string[];
}

const StatCard = ({ title, value, icon: Icon, color }: { 
  title: string;
  value: number;
  icon: any;
  color: string;
}) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    }}
    elevation={3}
  >
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: `${color}.light`,
        color: `${color}.main`,
      }}
    >
      <Icon fontSize="large" />
    </Box>
    <Box>
      <Typography variant="h5" component="div">
        {value}
      </Typography>
      <Typography color="text.secondary" variant="subtitle2">
        {title}
      </Typography>
    </Box>
  </Paper>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [todayData, setTodayData] = useState<DashboardData | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(dayjs().subtract(7, 'day')); // Début par défaut : 7 jours avant
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(dayjs()); // Fin par défaut : aujourd'hui

  useEffect(() => {
    fetchDashboardData();
  }, [period, fromDate, toDate]);

  const handlePeriodChange = (event: React.MouseEvent<HTMLElement>, newPeriod: 'week' | 'month' | 'year') => {
    if (newPeriod) {
      setPeriod(newPeriod);
  
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
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Format dates for the API
      const from = fromDate?.format('YYYY-MM-DD') || dayjs().subtract(7, 'day').format('YYYY-MM-DD');
      const to = toDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD');
      
      console.log('Fetching dashboard data for period:', { from, to, period });
      
      const [todayResponse, graphResponse] = await Promise.all([
        getDashboardToday(),
        getDashboardGraph({
          period,
          from,
          to,
        }),
      ]);
      
      console.log('Dashboard data received:', { 
        today: todayResponse.data,
        graph: graphResponse.data 
      });
      
      setTodayData(todayResponse.data);
      setGraphData(graphResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set default data to prevent UI breaking
      setTodayData({
        new_leads: 0,
        purchased_leads: 0,
        credits_purchased: 0,
        new_users: 0
      });
      setGraphData({
        leads: [],
        credits: [],
        labels: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!todayData || !graphData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Failed to load dashboard data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ToggleButtonGroup
            value={period}
            exclusive
            onChange={handlePeriodChange}
            size="small"
            color="primary"
          >
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="year">Year</ToggleButton>
</ToggleButtonGroup>


          {/* DatePickers */}
          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={(newValue) => setFromDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={(newValue) => setToDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
          />
        </Box>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <StatCard title="New Leads Today" value={todayData.new_leads ?? 0} icon={Assignment} color="primary" />
        <StatCard title="Leads Purchased Today" value={todayData.purchased_leads ?? 0} icon={TrendingUp} color="success" />
        <StatCard title="Credits Purchased Today" value={todayData.credits_purchased ?? 0} icon={CreditCard} color="warning" />
        <StatCard title="New Users Today" value={todayData.new_users ?? 0} icon={Person} color="info" />
      </Box>

      {/* Graphs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Leads Evolution</Typography>
          <BarChart
            xAxis={[{ scaleType: 'band', data: graphData.labels }]}
            series={[{ data: graphData.leads }]}
            height={300}
          />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Credits Evolution</Typography>
          <LineChart
            xAxis={[{ scaleType: 'point', data: graphData.labels }]}
            series={[{ data: graphData.credits }]}
            height={300}
          />
        </Paper>
      </Box>
    </Box>
  );
}
