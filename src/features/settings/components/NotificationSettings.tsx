import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Switch } from "../../../components/ui/switch"
import { useState } from "react"

export const NotificationSettings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [marketingEmails, setMarketingEmails] = useState(false)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Choisissez comment vous souhaitez être informé.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                        <span>Notifications par email</span>
                        <span className="font-normal leading-snug text-muted-foreground text-sm text-gray-500">
                            Recevoir un email pour chaque nouvelle notification majeure.
                        </span>
                    </Label>
                    <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                        <span>Notifications Push</span>
                        <span className="font-normal leading-snug text-muted-foreground text-sm text-gray-500">
                            Recevoir des notifications push sur votre appareil.
                        </span>
                    </Label>
                    <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                        <span>Emails Marketing</span>
                        <span className="font-normal leading-snug text-muted-foreground text-sm text-gray-500">
                            Recevoir des emails sur les nouvelles fonctionnalités et offres.
                        </span>
                    </Label>
                    <Switch
                        id="marketing-emails"
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
