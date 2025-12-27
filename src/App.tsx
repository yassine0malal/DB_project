import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { useEffect } from 'react'
import { useThemeStore } from './store/useThemeStore'

function App() {
    const theme = useThemeStore((state) => state.theme)

    // Apply theme class on mount and when theme changes
    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [theme])

    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    )
}

export default App
