import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useTheme } from './ThemeProvider'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Target,
  Users,
  Megaphone,
  Sun,
  Moon,
  LogOut,
  Home,
  Settings,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointer,
  ShoppingCart
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function ClientDashboard({ user, onLogout }) {
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
      const response = await fetch('http://localhost:5000/api/client/dashboard', {
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

  const company = dashboardData?.company || {}
  const kpis = dashboardData?.kpis || {}
  const campaigns = dashboardData?.campaigns || []
  const platformPerformance = dashboardData?.platform_performance || {}

  // Mock data for charts
  const performanceData = [
    { month: 'Jan', roi: 280, conversions: 45, revenue: 12500 },
    { month: 'Fev', roi: 320, conversions: 52, revenue: 15200 },
    { month: 'Mar', roi: 290, conversions: 48, revenue: 13800 },
    { month: 'Abr', roi: 350, conversions: 61, revenue: 18500 },
    { month: 'Mai', roi: 380, conversions: 55, revenue: 21200 },
    { month: 'Jun', roi: 420, conversions: 67, revenue: 25800 }
  ]

  const planColors = {
    starter: '#10B981',
    aceleracao: '#8B5CF6', 
    crescimento: '#EC4899'
  }

  const planNames = {
    starter: 'Starter',
    aceleracao: 'Aceleração',
    crescimento: 'Crescimento Exponencial'
  }

  const planLimits = {
    starter: { campaigns: 1, budget: 5000 },
    aceleracao: { campaigns: 2, budget: 20000 },
    crescimento: { campaigns: 4, budget: 50000 }
  }

  const currentPlanLimits = planLimits[company.plan] || planLimits.starter
  const campaignUsage = (campaigns.length / currentPlanLimits.campaigns) * 100
  const budgetUsage = ((company.monthly_budget || 0) / currentPlanLimits.budget) * 100

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
              <p className="text-sm text-muted-foreground">{company.name}</p>
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Badge 
              variant="outline" 
              style={{ 
                borderColor: planColors[company.plan],
                color: planColors[company.plan]
              }}
            >
              {planNames[company.plan]}
            </Badge>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">Cliente</p>
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
            to="/dashboard" 
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/dashboard/campaigns" 
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/dashboard/campaigns' ? 'text-primary' : 'text-muted-foreground'
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
              {/* Plan Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Uso do Plano {planNames[company.plan]}</span>
                    <Button variant="outline" size="sm">
                      Fazer Upgrade
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o uso dos recursos do seu plano
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Campanhas Ativas</span>
                        <span>{campaigns.length}/{currentPlanLimits.campaigns}</span>
                      </div>
                      <Progress value={campaignUsage} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Orçamento Mensal</span>
                        <span>R$ {(company.monthly_budget || 0).toLocaleString('pt-BR')}/R$ {currentPlanLimits.budget.toLocaleString('pt-BR')}</span>
                      </div>
                      <Progress value={budgetUsage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KPIs Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ROI</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-ai-success">{kpis.roi}%</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1 text-ai-success" />
                      +15% vs. mês anterior
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CAC</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {kpis.cac}</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1 text-ai-success" />
                      -12% vs. mês anterior
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">LTV/CAC</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-ai-primary">{kpis.ltv_cac}:1</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1 text-ai-success" />
                      +8% vs. mês anterior
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpis.conversion_rate}%</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1 text-ai-success" />
                      +3% vs. mês anterior
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Atribuída</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-ai-success">
                      R$ {(kpis.revenue_attributed || 0).toLocaleString('pt-BR')}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1 text-ai-success" />
                      +23% vs. mês anterior
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução do ROI</CardTitle>
                    <CardDescription>
                      Performance dos últimos 6 meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'roi' ? `${value}%` : value,
                            name === 'roi' ? 'ROI' : name === 'conversions' ? 'Conversões' : 'Receita'
                          ]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="roi" 
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Platform Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance por Plataforma</CardTitle>
                    <CardDescription>
                      ROAS por canal de marketing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(platformPerformance).map(([platform, data]) => (
                        <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-ai-gradient-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                              {platform.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium capitalize">{platform}</p>
                              <p className="text-sm text-muted-foreground">
                                R$ {data.spent?.toLocaleString('pt-BR')} investido
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-ai-success">{data.roas}x ROAS</p>
                            <p className="text-sm text-muted-foreground">
                              {data.conversions} conversões
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campaigns Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Campanhas Ativas</CardTitle>
                  <CardDescription>
                    Visão geral das suas campanhas em andamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="bg-ai-gradient-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                            {campaign.platform.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {campaign.impressions?.toLocaleString('pt-BR')}
                              </span>
                              <span className="flex items-center">
                                <MousePointer className="h-3 w-3 mr-1" />
                                {campaign.clicks?.toLocaleString('pt-BR')}
                              </span>
                              <span className="flex items-center">
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                {campaign.conversions}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-ai-success">{campaign.roas}x ROAS</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {campaign.spent?.toLocaleString('pt-BR')} / R$ {campaign.budget?.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {campaigns.length > 3 && (
                      <div className="text-center pt-4">
                        <Link to="/dashboard/campaigns">
                          <Button variant="outline">
                            Ver Todas as Campanhas ({campaigns.length})
                          </Button>
                        </Link>
                      </div>
                    )}
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

