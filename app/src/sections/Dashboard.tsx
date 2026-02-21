import { useState, useEffect } from 'react'
import { 
  Briefcase, 
  FileText, 
  Send, 
  TrendingUp, 
  Calendar,
  Clock,
  AlertCircle,
  MoreHorizontal,
  ArrowUpRight,
  Target,
  Zap,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { applicationAPI, autoApplyAPI } from '@/services/api'
import type { Application, UpcomingInterview, ApplicationStats } from '@/services/api'

const Dashboard = () => {
  const { refreshStats } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [upcomingInterviews, setUpcomingInterviews] = useState<UpcomingInterview[]>([])
  const [appStats, setAppStats] = useState<ApplicationStats | null>(null)
  const [autoApplyStatus, setAutoApplyStatus] = useState<{ enabled: boolean; stats: { today: number; maxPerDay: number } } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError('')
    try {
      // Load applications
      const appsResponse = await applicationAPI.getAll({ limit: 5 })
      setApplications(appsResponse.data || [])

      // Load stats
      const statsResponse = await applicationAPI.getStats()
      setAppStats(statsResponse.data || null)

      // Load upcoming interviews
      const interviewsResponse = await applicationAPI.getUpcomingInterviews()
      setUpcomingInterviews(interviewsResponse.data || [])

      // Load auto-apply status
      const autoApplyResponse = await autoApplyAPI.getStatus()
      setAutoApplyStatus(autoApplyResponse.data || null)

      // Refresh user stats
      await refreshStats()
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutoApply = async () => {
    try {
      const response = await autoApplyAPI.start()
      // Refresh data after auto-apply
      await loadDashboardData()
      alert(`Auto-applied to ${response.data?.applied || 0} jobs!`)
    } catch (err: any) {
      alert(err.message || 'Auto-apply failed')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Applied</Badge>
      case 'interview':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Interview</Badge>
      case 'pending':
      case 'screening':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
      case 'offer':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Offer</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
            <Button onClick={loadDashboardData} variant="outline" className="ml-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const stats = appStats?.statusCounts || {}
  const total = appStats?.total || 0
  const weeklyApps = appStats?.weeklyApplications || 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your job search progress.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Jobs Applied</p>
                  <p className="text-3xl font-bold text-gray-900">{total}</p>
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{weeklyApps} this week</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Interviews</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.interview || 0}</p>
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Upcoming</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Job Offers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.offer || 0}</p>
                  <div className="flex items-center gap-1 mt-2 text-purple-600 text-sm">
                    <Target className="w-4 h-4" />
                    <span>{stats.offer || 0} pending</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-gray-900">{(stats.applied || 0) + (stats.screening || 0)}</p>
                  <div className="flex items-center gap-1 mt-2 text-yellow-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Awaiting response</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold">Recent Applications</CardTitle>
                <Button variant="ghost" size="sm" className="text-purple-600">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No applications yet. Start applying to jobs!</p>
                    <Button onClick={handleAutoApply} className="mt-4 btn-primary">
                      <Zap className="w-4 h-4 mr-2" />
                      Auto Apply
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div 
                        key={app._id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {app.company.name?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{app.position.title}</p>
                            <p className="text-sm text-gray-500">{app.company.name} • {formatDate(app.appliedAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(app.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Withdraw</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Upcoming Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingInterviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming interviews</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingInterviews.map((item) => (
                      <div key={item.interview._id} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                            <Calendar className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.position.title}</p>
                            <p className="text-sm text-gray-600">{item.company.name}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(item.interview.scheduledAt).toLocaleString()}</span>
                            </div>
                            <Badge variant="outline" className="mt-2">
                              {item.interview.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button className="w-full mt-4" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Application Progress */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Weekly Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 mb-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{Math.min(100, Math.round((weeklyApps / 20) * 100))}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{weeklyApps} of 20 applications</p>
                </div>
                <Progress value={Math.min(100, (weeklyApps / 20) * 100)} className="h-2" />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {20 - weeklyApps > 0 ? `${20 - weeklyApps} more to reach your weekly goal!` : 'Weekly goal achieved!'}
                </p>
                <Button 
                  className="w-full mt-4 btn-primary"
                  onClick={handleAutoApply}
                  disabled={(autoApplyStatus?.stats?.today || 0) >= (autoApplyStatus?.stats?.maxPerDay || 10)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {autoApplyStatus?.enabled ? 'Auto Apply More' : 'Enable Auto Apply'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Update Resume
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleAutoApply}>
                    <Send className="w-4 h-4 mr-2" />
                    Start Auto Apply
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
