import { useEffect } from "react";

const useCheckToken = (setLoading, setIsLoggedIn) => {
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch(`${import.meta.env.VITE_API_URL}/auth/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token})
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    setIsLoggedIn(true);
                }
            })
            .catch(() => {
                localStorage.removeItem('token');
                window.location.href = '/login'
            })
            .finally(() => {
                setLoading(false);
            })
        } else {
            setLoading(false)
        }
    }, [])
}

export default useCheckToken;