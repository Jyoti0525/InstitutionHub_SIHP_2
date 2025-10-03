import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building, Mail, Phone, MapPin, User, Calendar, Shield, Award, Save, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function Profile() {
  const { selectedInstitution } = useStore()
  const [notificationSettings, setNotificationSettings] = useState({
    docVerification: true,
    deadlineReminders: true,
    performanceAlerts: true,
    monthlyReports: false
  })
  const [saveMessage, setSaveMessage] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'password' | 'users' | 'activity' | 'deactivate' | null>(null)

  const handleSavePreferences = () => {
    setSaveMessage('Preferences saved successfully!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleSecurityAction = (type: 'password' | 'users' | 'activity') => {
    setDialogType(type)
    setDialogOpen(true)
  }

  const handleDeactivation = () => {
    setDialogType('deactivate')
    setDialogOpen(true)
  }

  if (!selectedInstitution) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Building className="w-16 h-16 text-neutral-text-muted opacity-50" />
        <p className="text-neutral-text-muted text-lg">No institution selected</p>
        <p className="text-sm text-neutral-text-secondary">Please select an institution to view profile</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Institution Profile</h1>
        <p className="text-neutral-text-secondary">
          Manage your institution's information and settings
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="accreditation">Accreditation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Institution Information
              </CardTitle>
              <CardDescription>
                Basic details about your institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inst-name">Institution Name</Label>
                  <Input id="inst-name" value={selectedInstitution.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inst-id">Institution ID</Label>
                  <Input id="inst-id" value={selectedInstitution.id} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inst-type">Institution Type</Label>
                  <Input id="inst-type" value={selectedInstitution.type} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inst-status">Status</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Badge variant={
                      selectedInstitution.submissionStatus === 'approved' ? 'verified' :
                      selectedInstitution.submissionStatus === 'pending_review' ? 'pending' : 'warning'
                    }>
                      {selectedInstitution.submissionStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inst-state">State</Label>
                <Input id="inst-state" value={selectedInstitution.state} readOnly />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dsi-score">DSI Score</Label>
                  <Input
                    id="dsi-score"
                    value={selectedInstitution.currentDSI.toFixed(1)}
                    readOnly
                    className="font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="composite-score">Composite Score</Label>
                  <Input
                    id="composite-score"
                    value={selectedInstitution.compositeScore.toFixed(1)}
                    readOnly
                    className="font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="naac-grade">NAAC Grade</Label>
                  <Input
                    id="naac-grade"
                    value={selectedInstitution.naacGrade || 'N/A'}
                    readOnly
                    className="font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last-review">Last Review Date</Label>
                  <Input
                    id="last-review"
                    value={selectedInstitution.lastUpdated || 'Not reviewed yet'}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next-deadline">Next Submission Deadline</Label>
                  <Input
                    id="next-deadline"
                    value={selectedInstitution.deadline || 'N/A'}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Update contact details for official communication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Official Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="admin@institution.edu.in"
                    defaultValue="admin@abctech.edu.in"
                  />
                  <Button variant="outline" size="icon">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+91-XX-XXXX-XXXX"
                    defaultValue="+91-22-1234-5678"
                  />
                  <Button variant="outline" size="icon">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="contact-address"
                    placeholder="Complete address"
                    defaultValue="123 Education Street, Mumbai"
                  />
                  <Button variant="outline" size="icon">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-website">Website</Label>
                <div className="flex gap-2">
                  <Input
                    id="contact-website"
                    type="url"
                    placeholder="https://www.institution.edu.in"
                    defaultValue="https://www.abctech.edu.in"
                  />
                  <Button variant="outline" size="icon">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Primary Contact Person</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-person">Name</Label>
                    <Input
                      id="contact-person"
                      placeholder="Dr. Full Name"
                      defaultValue="Dr. Suresh Kumar"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-designation">Designation</Label>
                    <Input
                      id="contact-designation"
                      placeholder="Principal/Director"
                      defaultValue="Principal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-person-email">Email</Label>
                    <Input
                      id="contact-person-email"
                      type="email"
                      placeholder="contact@institution.edu.in"
                      defaultValue="principal@abctech.edu.in"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-person-phone">Mobile</Label>
                    <Input
                      id="contact-person-phone"
                      type="tel"
                      placeholder="+91-XXXXXXXXXX"
                      defaultValue="+91-98765-43210"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save All Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accreditation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Accreditation & Recognition
              </CardTitle>
              <CardDescription>
                Your institution's accreditation status and certifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">NAAC Accreditation</h4>
                    <Badge variant="verified">Active</Badge>
                  </div>
                  <p className="text-sm text-neutral-text-secondary mb-2">
                    Grade: <span className="font-bold text-success">{selectedInstitution.naacGrade || 'A+'}</span>
                  </p>
                  <p className="text-xs text-neutral-text-muted">Valid until: April 2027</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">AICTE Approval</h4>
                    <Badge variant="verified">Active</Badge>
                  </div>
                  <p className="text-sm text-neutral-text-secondary mb-2">
                    Approval ID: <span className="font-mono text-xs">1-XXXXXXX</span>
                  </p>
                  <p className="text-xs text-neutral-text-muted">Valid until: June 2026</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">NBA Accreditation</h4>
                    <Badge variant="verified">Active</Badge>
                  </div>
                  <p className="text-sm text-neutral-text-secondary mb-2">
                    Programs: <span className="font-semibold">6 UG Programs</span>
                  </p>
                  <p className="text-xs text-neutral-text-muted">Valid until: December 2025</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">NIRF Ranking</h4>
                    <Badge variant="info">Participated</Badge>
                  </div>
                  <p className="text-sm text-neutral-text-secondary mb-2">
                    Rank: <span className="font-bold">Band 151-200</span>
                  </p>
                  <p className="text-xs text-neutral-text-muted">Year: 2024</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">University Affiliation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-neutral-text-secondary">Affiliated University:</span>
                    <span className="text-sm font-medium">Mumbai University</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-neutral-text-secondary">Affiliation Code:</span>
                    <span className="text-sm font-mono">MU/AFF/2020/567</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-neutral-text-secondary">Valid Until:</span>
                    <span className="text-sm font-medium">March 2028</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Other Recognitions</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">UGC Recognized</Badge>
                  <Badge variant="outline">NAAC A+ Grade</Badge>
                  <Badge variant="outline">ISO 9001:2015 Certified</Badge>
                  <Badge variant="outline">Autonomous Status</Badge>
                  <Badge variant="outline">Research Institution</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account preferences and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Notification Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Document Verification Updates</p>
                      <p className="text-xs text-neutral-text-muted">Get notified when documents are verified</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.docVerification}
                      onChange={(e) => setNotificationSettings({...notificationSettings, docVerification: e.target.checked})}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Deadline Reminders</p>
                      <p className="text-xs text-neutral-text-muted">Receive reminders before deadlines</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.deadlineReminders}
                      onChange={(e) => setNotificationSettings({...notificationSettings, deadlineReminders: e.target.checked})}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Performance Alerts</p>
                      <p className="text-xs text-neutral-text-muted">Alerts when DSI score changes significantly</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.performanceAlerts}
                      onChange={(e) => setNotificationSettings({...notificationSettings, performanceAlerts: e.target.checked})}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Monthly Reports</p>
                      <p className="text-xs text-neutral-text-muted">Receive monthly performance summaries</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.monthlyReports}
                      onChange={(e) => setNotificationSettings({...notificationSettings, monthlyReports: e.target.checked})}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h4 className="font-semibold">Security</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSecurityAction('password')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSecurityAction('users')}>
                    <User className="w-4 h-4 mr-2" />
                    Manage Users & Permissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSecurityAction('activity')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    View Activity Log
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full" onClick={handleDeactivation}>
                  Request Account Deactivation
                </Button>
                <p className="text-xs text-neutral-text-muted mt-2 text-center">
                  This will disable your account and notify the administrator
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                {saveMessage && (
                  <div className="flex items-center gap-2 text-success text-sm">
                    <Check className="w-4 h-4" />
                    {saveMessage}
                  </div>
                )}
                <Button onClick={handleSavePreferences}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs for Security Actions */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'password' && 'Change Password'}
              {dialogType === 'users' && 'Manage Users & Permissions'}
              {dialogType === 'activity' && 'Activity Log'}
              {dialogType === 'deactivate' && 'Confirm Account Deactivation'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'password' && 'Enter your current password and choose a new one.'}
              {dialogType === 'users' && 'Manage user access and permissions for your institution.'}
              {dialogType === 'activity' && 'View recent activity and login history.'}
              {dialogType === 'deactivate' && 'Are you sure you want to request account deactivation? This action requires administrator approval.'}
            </DialogDescription>
          </DialogHeader>

          {dialogType === 'password' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button className="w-full" onClick={() => {
                alert('Password change request sent!')
                setDialogOpen(false)
              }}>
                Change Password
              </Button>
            </div>
          )}

          {dialogType === 'users' && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-text-secondary">User management features coming soon. Contact your administrator for immediate access changes.</p>
              <Button variant="outline" className="w-full" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </div>
          )}

          {dialogType === 'activity' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {[
                  { action: 'Document uploaded', time: '2 hours ago' },
                  { action: 'Profile updated', time: '1 day ago' },
                  { action: 'Login from Mumbai', time: '2 days ago' },
                  { action: 'Settings changed', time: '3 days ago' }
                ].map((log, i) => (
                  <div key={i} className="flex justify-between p-3 border rounded">
                    <span className="text-sm">{log.action}</span>
                    <span className="text-xs text-neutral-text-muted">{log.time}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </div>
          )}

          {dialogType === 'deactivate' && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-text-secondary">This will send a deactivation request to the administrator. Your account will remain active until approved.</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => {
                  alert('Deactivation request sent to administrator')
                  setDialogOpen(false)
                }}>
                  Confirm Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
