import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  MoreHorizontal,
  MapPin,
  DollarSign,
  ExternalLink,
  MessageSquare,
  Phone,
  Download,
  Loader2,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { applicationAPI } from '@/services/api'
import type { Application, ApplicationStats } from '@/services/api'

const ApplicationTracker = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<ApplicationStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 })

  useEffect(() => {
    loadData()
  }, [statusFilter, searchQuery, pagination.page])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load applications
      const appsResponse = await applicationAPI.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
        page: pagination.page,
        limit: pagination.limit,
      })
      setApplications(appsResponse.data || [])
      if (appsResponse.pagination) {
        setPagination(appsResponse.pagination)
      }

      // Load stats
      const statsResponse = await applicationAPI.getStats()
      setStats(statsResponse.data || null)
    } catch (err: any) {
      setError(err.message || 'Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await applicationAPI.update(id, { status: newStatus as any })
      await loadData()
    } catch (err: any) {
      setError(err.message || 'Update failed')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Applied</Badge>
      case 'interview':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Interview</Badge>
      case 'screening':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Screening</Badge>
      case 'pending':
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const statusCounts = stats?.statusCounts || {}

  if (isLoading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading applications...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Tracker</h1>
            <p className="text-gray-600">Track and manage all your job applications in one place.</p>
          </div>
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Application
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={loadData} variant="outline" size="sm">Retry</Button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Applied</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.applied || 0}</p>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Interview</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.interview || 0}</p>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Offers</p>
              <p className="text-2xl font-bold text-purple-600">{statusCounts.offer || 0}</p>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{(statusCounts.screening || 0) + (statusCounts.pending || 0)}</p>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.rejected || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search companies or positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications List */}
        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="board">Board View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">No applications found</p>
                <Button className="btn-primary">Add Your First Application</Button>
              </div>
            ) : (
              applications.map((app) => (
                <Dialog key={app._id}>
                  <DialogTrigger asChild>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg`}>
                              {app.company.name?.[0] || '?'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{app.position.title}</h3>
                                {getStatusBadge(app.status)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{app.company.name}</p>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                {app.position.location?.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {app.position.location.city}
                                    {app.position.location.isRemote && ' (Remote)'}
                                  </span>
                                )}
                                {app.position.salary?.min && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    ${app.position.salary.min.toLocaleString()}+
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Applied {formatDate(app.appliedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right mr-4">
                              <p className="text-sm font-medium text-gray-900">{app.stage}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(app.lastActivityAt).toLocaleDateString()}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Job Posting
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Add Note
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 mr-2" />
                                  Export Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {app.company.name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="text-lg">{app.position.title}</p>
                          <p className="text-sm font-normal text-gray-500">{app.company.name}</p>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                      {/* Status */}
                      <div className="flex items-center gap-4">
                        {getStatusBadge(app.status)}
                        <div>
                          <p className="font-medium">{app.stage}</p>
                          {app.nextStep && <p className="text-sm text-gray-500">{app.nextStep}</p>}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4">
                        {app.position.location?.city && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Location</p>
                            <p className="font-medium flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {app.position.location.city}, {app.position.location.state}
                              {app.position.location.isRemote && ' (Remote)'}
                            </p>
                          </div>
                        )}
                        {app.position.salary?.min && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Salary Range</p>
                            <p className="font-medium flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${app.position.salary.min.toLocaleString()} - ${app.position.salary.max?.toLocaleString()}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Applied Date</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(app.appliedAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Source</p>
                          <p className="font-medium capitalize">{app.source}</p>
                        </div>
                      </div>

                      {/* Update Status */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Update Status</p>
                        <div className="flex gap-2">
                          {['applied', 'screening', 'interview', 'offer', 'rejected'].map((status) => (
                            <Button
                              key={status}
                              variant={app.status === status ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusChange(app._id, status)}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {app.notes && app.notes.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Notes</p>
                          <div className="space-y-2">
                            {app.notes.map((note, i) => (
                              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">{note.content}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDate(note.createdAt)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button className="flex-1">
                          <Phone className="w-4 h-4 mr-2" />
                          Schedule Follow-up
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Job Posting
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            )}
          </TabsContent>

          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['applied', 'interview', 'offer', 'screening', 'rejected'].map((status) => (
                <div key={status} className="bg-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold capitalize">{status}</h3>
                    <Badge variant="secondary">
                      {applications.filter(a => a.status === status).length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {applications
                      .filter(a => a.status === status)
                      .map((app) => (
                        <Card key={app._id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm mb-2">
                              {app.company.name?.[0] || '?'}
                            </div>
                            <p className="font-medium text-sm line-clamp-1">{app.position.title}</p>
                            <p className="text-xs text-gray-500">{app.company.name}</p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationTracker
