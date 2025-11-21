"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme, systemTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-9 h-9" /> // Placeholder to prevent layout shift
    }

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <button
            onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
            className="p-2 rounded-md hover:bg-white/10 transition-colors text-white cursor-pointer"
            aria-label="Toggle theme"
        >
            <i className={`fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
        </button>
    )
}
