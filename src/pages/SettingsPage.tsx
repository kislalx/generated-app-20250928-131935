import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, Palette, Bell } from "lucide-react";
export function SettingsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Manage your application settings and preferences. More options coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-muted rounded-full">
                  <Building className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Company Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your company name, logo, and address.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-muted rounded-full">
                  <Palette className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Appearance</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize the look and feel of the application.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-muted rounded-full">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your notification preferences.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
       <div className="text-center text-muted-foreground mt-16">
        <p>Built with ❤��� at Cloudflare</p>
      </div>
    </div>
  );
}