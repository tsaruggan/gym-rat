import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

const UserContext = createContext();

export default function UserProvider({ children, userId }) {
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(null);
    const [units, setUnits] = useState('lb');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultDarkMode = prefersDarkMode !== undefined ? prefersDarkMode : false;
        setDarkMode(defaultDarkMode);
    }, []);

    useEffect(() => {
        updatePrimeReactTheme(darkMode);
        updateBrowserTheme(darkMode);
    }, [darkMode]);

    const updatePrimeReactTheme = (darkMode) => {
        const lightTheme = "/themes/nano/theme.css";
        const darkTheme = "/themes/soho-dark/theme.css";
        const theme = darkMode ? darkTheme : lightTheme;

        let themeLink = document.getElementById('theme-link');
        if (themeLink) {
            themeLink.href = theme;
        } else {
            themeLink = document.createElement('link');
            themeLink.id = 'theme-link';
            themeLink.rel = 'stylesheet';
            document.head.appendChild(themeLink);
        }
    }

    const updateBrowserTheme = (darkMode) => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    
        let metaTag = document.querySelector('meta[name="theme-color"]');
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'theme-color';
            document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', darkMode ? '#000000' : '#ffffff');
    };    

    useEffect(() => {
        // Check if the user exists and get user object
        const validateQueryParams = async () => {
            try {
                const response = await fetch(`/api/user?userId=${userId}`);
                const result = await response.json();

                // Redirect if rate limiting
                if (response.status === 429) {
                    router.replace('/429');
                    return;
                }

                // Redirect if error or user does not exist
                if (!response.ok || !result.user) {
                    router.push('/404');
                    return;
                }

                // Update app state (turn off loading)
                setUser(result.user);
                setDarkMode(result.user.preferences.darkMode);
                setUnits(result.user.preferences.units);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                router.push('/404');
            }
        }

        if (userId) {
            validateQueryParams();
        }
    }, [userId]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <BlockLoader />
            </div>
        );
    }

    return (
        <UserContext.Provider value={{ user, darkMode, units, setDarkMode, setUnits }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

function BlockLoader(props) {
    const blocks = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % blocks.length);
        }, 100);

        return () => clearInterval(interval);
    }, [blocks.length]);

    return (
        <span>
            {blocks[index]}
        </span>
    );
};