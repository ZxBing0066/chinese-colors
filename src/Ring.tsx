import { useEffect, useMemo, useState } from 'react';

import './ring.scss';

const Size = 100;
const Offset = 3;
const HalfSize = 100 / 2;
const Radius = HalfSize - Offset;
const Perimeter = 2 * Radius * Math.PI;
const StrokeWidth = Offset * 2;
const Diameter = Radius * 2;

const ViewBox = `0 0 ${Size} ${Size}`;
const Path = `M ${HalfSize},${HalfSize} m 0,-${Radius} a ${Radius},${Radius} 0 1 1 0,${Diameter} a ${Radius},${Radius} 0 1 1 0,-${Diameter}`;

const BGStrokeDasharray = `${Perimeter}px, ${Perimeter}px`;

const Ring = ({ percent = 0.5, text }: { percent: number; text: string }) => {
    const [displayPercent, setDisplayPercent] = useState(0);
    const strokeDasharray = useMemo(() => `${displayPercent * Perimeter}px, ${Perimeter}px`, [displayPercent]);
    useEffect(() => {
        setDisplayPercent(percent);
    }, [percent]);
    return (
        <div className='ring'>
            <div className='text'>{text}</div>
            <svg viewBox={ViewBox} className='svg'>
                <path
                    d={Path}
                    className='bg'
                    strokeLinecap='round'
                    strokeWidth={StrokeWidth}
                    fillOpacity={0}
                    style={{
                        strokeDasharray: BGStrokeDasharray
                    }}
                />
                <path
                    d={Path}
                    className='progress'
                    strokeLinecap='round'
                    strokeWidth={StrokeWidth}
                    fillOpacity={0}
                    style={{
                        strokeDasharray
                    }}
                />
            </svg>
        </div>
    );
};

export default Ring;
