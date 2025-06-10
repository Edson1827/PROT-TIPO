import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, Zap } from 'lucide-react'
import trackingUtils from '../utils/tracking'

export default function LoginPage({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { theme, toggleTheme } = useTheme()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Track successful login
        trackingUtils.trackLogin(data.user.role, data.user.company?.plan || 'unknown')
        onLogin(data.user, data.access_token)
      } else {
        // Track login error
        trackingUtils.trackError('login_failed', data.error || 'Login failed')
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')
    const name = formData.get('name')
    const company_name = formData.get('company_name')
    const plan = formData.get('plan')

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role: 'client',
          company_name,
          plan
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Track successful registration
        trackingUtils.trackSignUp('client', plan)
        trackingUtils.trackConversion('registration', 0, plan)
        onLogin(data.user, data.access_token)
      } else {
        // Track registration error
        trackingUtils.trackError('registration_failed', data.error || 'Registration failed')
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const createDemoData = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/demo-data', {
        method: 'POST',
      })
      alert('Dados de demonstração criados! Use admin@ai.growth / admin123 para agência')
    } catch (err) {
      console.error('Erro ao criar dados demo:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-50"
        onClick={toggleTheme}
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-ai-gradient-primary p-3 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-ai-gradient-primary bg-clip-text text-transparent">
            AI.GROWTH
          </h1>
          <p className="text-muted-foreground">
            Plataforma de Growth Marketing + Tráfego Pago
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login/Register Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Entrar na Plataforma</CardTitle>
                <CardDescription>
                  Acesse seu dashboard personalizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-ai-gradient-primary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>

                {/* Demo Accounts */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <p className="text-sm text-muted-foreground text-center">
                    Contas de demonstração:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="bg-muted p-2 rounded">
                      <strong>Agência:</strong> admin@ai.growth / admin123
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <strong>Cliente:</strong> cliente@techsolve.com / cliente123
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={createDemoData}
                  >
                    Criar Dados Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Comece a usar a plataforma AI.GROWTH
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Nome Completo</Label>
                    <Input
                      id="reg-name"
                      name="name"
                      type="text"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Senha</Label>
                    <Input
                      id="reg-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input
                      id="company-name"
                      name="company_name"
                      type="text"
                      placeholder="Sua Empresa Ltda"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan">Plano</Label>
                    <Select name="plan" defaultValue="starter">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter - R$ 197/mês</SelectItem>
                        <SelectItem value="aceleracao">Aceleração - R$ 297/mês</SelectItem>
                        <SelectItem value="crescimento">Crescimento Exponencial - R$ 397/mês</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-ai-gradient-primary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

