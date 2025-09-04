import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getYear } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Select } from '../ui/Select';
import { MonthlyCostsCard } from '../dashboard/MonthlyCostsCard';
import { Factura } from '../../types';
import { formatCurrency } from '../../lib/utils';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

interface ReportChartsProps {
    facturas: Factura[];
}

export const ReportCharts: React.FC<ReportChartsProps> = ({ facturas }) => {
    const availableYears = useMemo(() => 
        [...new Set(facturas.map(f => getYear(new Date(f.data_factura))))].sort((a, b) => b - a), 
        [facturas]
    );

    const [selectedYear, setSelectedYear] = useState<number>(availableYears[0] || new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 for all months

    const filteredTotal = useMemo(() => {
        return facturas
        .filter(f => {
            const date = new Date(f.data_factura);
            const yearMatches = getYear(date) === selectedYear;
            const monthMatches = selectedMonth === 0 ? true : (date.getMonth() + 1) === selectedMonth;
            return yearMatches && monthMatches;
        })
        .reduce((sum, f) => sum + f.valor, 0);
    }, [facturas, selectedYear, selectedMonth]);

    const monthlyCostsInYear = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => ({
        mes: new Date(0, i).toLocaleString('pt-PT', { month: 'short' }).replace('.', ''),
        valor: 0,
        }));
        facturas.forEach(f => {
        const date = new Date(f.data_factura);
        if (getYear(date) === selectedYear) {
            months[date.getMonth()].valor += f.valor;
        }
        });
        return months;
    }, [facturas, selectedYear]);
    
    const yearlyTotalCosts = useMemo(() => {
        const yearlyData: { [year: number]: number } = {};
        facturas.forEach(f => {
        const year = getYear(new Date(f.data_factura));
        if (!yearlyData[year]) yearlyData[year] = 0;
        yearlyData[year] += f.valor;
        });
        return Object.entries(yearlyData)
        .map(([year, valor]) => ({ year: Number(year), valor }))
        .sort((a, b) => a.year - b.year);
    }, [facturas]);

    const statusData = useMemo(() => [
        { name: 'Submetidas', value: facturas.filter(f => f.status_id === 1).length },
        { name: 'Em Análise', value: facturas.filter(f => f.status_id === 2).length },
        { name: 'Aprovadas', value: facturas.filter(f => f.status_id === 3).length },
        { name: 'Rejeitadas', value: facturas.filter(f => f.status_id === 4).length },
        { name: 'Pagas', value: facturas.filter(f => f.status_id === 5).length }
    ], [facturas]);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Custos por Período</CardTitle>
                        </CardHeader>
                        <div className="space-y-4 p-6 pt-0">
                            <div className="flex gap-4">
                                <Select label="Ano" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                                    {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                                </Select>
                                <Select label="Mês" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
                                    <option value={0}>Todos</option>
                                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('pt-PT', { month: 'long' })}</option>)}
                                </Select>
                            </div>
                            <div className="text-center bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Total para o período selecionado</p>
                                <p className="text-3xl font-bold text-blue-600">{formatCurrency(filteredTotal)}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
                    <Card>
                        <CardHeader><CardTitle>Custos Mensais ({selectedYear})</CardTitle></CardHeader>
                        <div className="h-80 pr-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={monthlyCostsInYear}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" fontSize={12} />
                                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} fontSize={12} />
                                    <Tooltip formatter={(value: any) => [formatCurrency(value), 'Valor']} />
                                    <Bar dataKey="valor" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MonthlyCostsCard facturas={facturas} />
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card>
                    <CardHeader><CardTitle>Status das Faturas</CardTitle></CardHeader>
                    <div className="h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey="value" paddingAngle={5}>
                            {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
                </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card>
                    <CardHeader><CardTitle>Evolução Anual dos Custos</CardTitle></CardHeader>
                    <div className="h-80 pr-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={yearlyTotalCosts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value: any) => [formatCurrency(value), 'Total']} />
                        <Line type="monotone" dataKey="valor" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                </Card>
                </motion.div>
            </div>
        </>
    )
}
