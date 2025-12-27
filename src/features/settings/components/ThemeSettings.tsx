import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Moon, Sun } from "lucide-react"
import { useThemeStore } from "../../../store/useThemeStore"
import { cn } from "../../../utils/cn"

export const ThemeSettings = () => {
    const { theme, setTheme } = useThemeStore()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                    Personnalisez l'apparence de l'application. Basculez entre le mode clair et sombre.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setTheme('light')}
                        className={cn(
                            "cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors",
                            theme === 'light'
                                ? "border-primary bg-gray-50 dark:bg-gray-700"
                                : "border-transparent hover:border-gray-300 dark:hover:border-gray-600 bg-gray-100 dark:bg-gray-800"
                        )}
                    >
                        <Sun className="h-8 w-8 text-orange-500" />
                        <span className="font-medium">Mode Clair</span>
                    </button>
                    <button
                        onClick={() => setTheme('dark')}
                        className={cn(
                            "cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors",
                            theme === 'dark'
                                ? "border-primary bg-gray-800 text-white"
                                : "border-transparent hover:border-gray-300 dark:hover:border-gray-600 bg-gray-900 text-white"
                        )}
                    >
                        <Moon className="h-8 w-8 text-blue-300" />
                        <span className="font-medium">Mode Sombre</span>
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
