import { useState, useEffect } from 'react';

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({x : null, y : null});

    const updateMousePosition = ev => {
        console.log('updateMousePosition called /......');
        setMousePosition({x : ev.clientX, y : ev.clientY});
    }

    useEffect(() => {
        window.addEventListener('mousemove', updateMousePosition);

        return ()=> window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    return mousePosition;
};

export default useMousePosition;