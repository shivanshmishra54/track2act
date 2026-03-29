import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function UserManagementPage() {
  return (
    <div className="flex-1 p-6 flex flex-col h-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          User Management
        </h1>
        <p className="text-xl text-muted-foreground">Manage all users, roles, and permissions in the Track2Act system</p>
      </div>

      <Card className="w-full max-w-4xl flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Complete User Control Panel
          </CardTitle>
          <CardDescription>
            Create new users, assign roles (ADMIN, DRIVER, COMPANY_OFFICER, CUSTOMER), manage permissions, 
            view activity logs, and handle account suspensions. Full RBAC administration dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-muted/50 rounded-xl border">
              <div className="text-3xl font-bold text-primary mb-2">247</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="p-6 bg-muted/50 rounded-xl border">
              <div className="text-3xl font-bold text-green-600 mb-2">156</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="p-6 bg-muted/50 rounded-xl border">
              <div className="text-3xl font-bold text-orange-600 mb-2">42</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Create New User
              </Button>
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" /> Advanced Search
              </Button>
            </div>
            <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
              <div className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Quick Actions</div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1 h-10">
                  <Edit className="h-4 w-4 mr-1" /> Bulk Edit
                </Button>
                <Button variant="destructive" size="sm" className="flex-1 h-10">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50">
            <div className="text-center text-muted-foreground py-12">
              <Users className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready for User Management Features</h3>
              <p className="max-w-md mx-auto">
                User table with search, filtering by role/location/status, inline editing, 
                role assignment matrix, audit trail viewer, and automated permission sync.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
