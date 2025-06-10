import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTheme } from './ThemeProvider'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Building2,
  Megaphone,
  Sun,
  Moon,
  LogOut,
  Home,
  Settings,
  Zap
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AgencyDashboard({ user, onLogout }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:5000/api/agency/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  const kpis = dashboardData?.kpis || {}
  const plansPerformance = dashboardData?.plans_performance || []
  const topCompanies = dashboardData?.top_companies || []

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, clients: 15 },
    { month: 'Fev', revenue: 52000, clients: 18 },
    { month: 'Mar', revenue: 48000, clients: 16 },
    { month: 'Abr', revenue: 61000, clients: 22 },
    { month: 'Mai', revenue: 55000, clients: 20 },
    { month: 'Jun', revenue: 67000, clients: 25 }
  ]

  const planColors = {
    starter: '#10B981',
    aceleracao: '#8B5CF6', 
    crescimento: '#EC4899'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="bg-ai-gradient-primary p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ai-primary">AI.GROWTH</h1>
              <p className="text-sm text-muted-foreground">Dashboard da Agência</p>
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
            
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="flex h-12 items-center px-6 space-x-6">
          <Link 
            to="/agency" 
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/agency' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/agency/companies" 
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/agency/companies' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Empresas</span>
          </Link>
          <Link 
            to="/agency/campaigns" 
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/agency/campaigns' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Megaphone className="h-4 w-4" />
            <span>Campanhas</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <Routes>
          <Route path="/" element={
            <div className="space-y-6">
              {/* KPIs Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-ai-primary">{kpis.total_companies}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% vs. mês anterior
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Gerenciada</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-ai-success">
                      R$ {(kpis.total_budget || 0).toLocaleString('pt-BR')}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      /mês em investimento
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-ai-success">{kpis.roi}%</div>
                    <p className="text-xs text-muted-foreground">
                      +8% vs. mês anterior
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CAC Médio</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {kpis.avg_cac}</div>
                    <p className="text-xs text-muted-foreground">
                      -15% vs. mês anterior
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-ai-primary">{kpis.total_conversions}</div>
                    <p className="text-xs text-muted-foreground">
                      +23% vs. mês anterior
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução da Receita</CardTitle>
                    <CardDescription>
                      Receita gerenciada nos últimos 6 meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'revenue' ? `R$ ${value.toLocaleString('pt-BR')}` : value,
                            name === 'revenue' ? 'Receita' : 'Clientes'
                          ]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#8B5CF6" 
                          fill="#8B5CF6" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Plans Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance por Plano</CardTitle>
                    <CardDescription>
                      Distribuição de clientes e performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={plansPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="plan" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'count' ? `${value} clientes` : `${value.toFixed(2)}x`,
                            name === 'count' ? 'Clientes' : 'ROAS Médio'
                          ]}
                        />
                        <Bar dataKey="count" fill="#10B981" />
                        <Bar dataKey="avg_roas" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>
                    Clientes com melhor performance de ROAS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCompanies.map((company, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="bg-ai-gradient-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline" 
                                style={{ 
                                  borderColor: planColors[company.plan],
                                  color: planColors[company.plan]
                                }}
                              >
                                {company.plan}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-ai-success">{company.roas}x ROAS</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {company.revenue.toLocaleString('pt-BR')} receita
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

