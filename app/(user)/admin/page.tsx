import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function UserInfoPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h3 className="text-2xl font-bold tracking-tight">
            Profile Settings
          </h3>
          <p className="text-muted-foreground">
            Manage your public profile and account preferences.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Nav (Optional) */}
          <aside className="md:w-1/4 space-y-2">
            <nav className="flex flex-col space-y-1">
              <Button variant="secondary" className="justify-start">
                Public Profile
              </Button>
              <Button variant="ghost" className="justify-start">
                Account
              </Button>
              <Button variant="ghost" className="justify-start">
                Security
              </Button>
              <Button variant="ghost" className="justify-start">
                Notifications
              </Button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  This information will be displayed publicly, so be careful
                  what you share.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload Placeholder */}
                <div className="flex items-center gap-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      defaultValue="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      defaultValue="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a little bit about yourself..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-x-2">
                <Button variant="ghost">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
