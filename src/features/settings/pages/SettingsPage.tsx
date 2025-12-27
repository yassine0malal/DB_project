import { Settings } from "lucide-react"
import { NotificationSettings } from "../components/NotificationSettings"
import { ThemeSettings } from "../components/ThemeSettings"
import { useAuthStore } from "../../auth/store/useAuthStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"

export const SettingsPage = () => {
    const { user } = useAuthStore()

    return (
        <div className="container mx-auto max-w-4xl py-6 space-y-8">
            <div className="flex items-center gap-3 border-b pb-4">
                <Settings className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                    <p className="text-muted-foreground text-gray-500">
                        Gérez vos préférences et les paramètres de votre compte.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Profile Section (Read-only for now or quick edit) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profil</CardTitle>
                        <CardDescription>Vos informations personnelles.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" value={user?.firstName || ''} disabled readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" value={user?.lastName || ''} disabled readOnly />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user?.email || ''} disabled readOnly />
                        </div>
                        <div className="pt-2">
                            <Button variant="outline" onClick={() => window.location.href = '/profile'}>
                                Modifier le profil complet
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <ThemeSettings />
                <NotificationSettings />

                {/* Privacy Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Confidentialité</CardTitle>
                        <CardDescription>Gérez qui peut voir vos informations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-500">
                            Les paramètres de confidentialité seront bientôt disponibles.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
