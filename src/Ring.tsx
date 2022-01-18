import { useMemo } from 'react';

const Size = 100;
const Offset = 3;
const HalfSize = 100 / 2;
const Radius = HalfSize - Offset;
const Perimeter = 2 * Radius * Math.PI;

const ViewBox = `0 0 ${Size} ${Size}`;
const Path = `M ${HalfSize},${HalfSize} m 0,-${Radius} a ${Radius},${Radius} 0 1 1 0,94 a ${Radius},${Radius} 0 1 1 0,-94`;

const Ring = ({ percent }: { percent: number }) => {
    const strokeDasharray = useMemo(() => `${percent * Perimeter}px, ${Perimeter}px`, [percent]);
    return (
        <svg viewBox={ViewBox}>
            <path
                d=''
                stroke='gray'
                stroke-linecap='round'
                stroke-width='6'
                opacity='1'
                fill-opacity='0'
                style={{
                    strokeDasharray
                }}
                // style='stroke-dasharray: 221.482px, 295.31px;/* stroke-dashoffset: 0px; *//* transition: stroke-dashoffset 0s ease 0s, stroke-dasharray 0s ease 0s, stroke ease 0s, stroke-width ease 0.3s, opacity ease 0s; */'
            ></path>
        </svg>
    );
};

export default Ring;
