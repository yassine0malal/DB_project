import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Moon, Sun } from "lucide-react"

export const ThemeSettings = () => {
    // This is a mock implementation. Ideally, connect to a ThemeProvider context.
    return (
        <Card>
            <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                    Personnalisez l'apparence de l'application. basculez entre le mode clair et sombre.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="cursor-pointer border-2 border-primary rounded-lg p-4 flex flex-col items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Sun className="h-8 w-8 text-orange-500" />
                        <span className="font-medium">Mode Clair</span>
                    </div>
                    <div className="cursor-pointer border-2 border-transparent hover:border-gray-200 rounded-lg p-4 flex flex-col items-center gap-2 bg-gray-900 text-white transition-colors">
                        <Moon className="h-8 w-8 text-blue-300" />
                        <span className="font-medium">Mode Sombre</span>
                    </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    <p>Le mode sombre sera bientôt disponible pour toute l'application.</p>
                </div>
            </CardContent>
        </Card>
    )
}
