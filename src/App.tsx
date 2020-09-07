import React, { useEffect, useState } from 'react';
import './App.scss';

interface Color {
    red?: number
    green?: number
    blue?: number
}

interface LightProps {
    color: Color
}

const Light = ({color}: LightProps) => {
    const bgColor = (color.red === undefined && color.green === undefined && color.blue === undefined) ? 'rgba(0, 0, 0, 0)' : `rgb(${color.red || 0}, ${color.green || 0}, ${color.blue || 0})`
    return <div style={{
        display: 'block',
        height: '1em',
        width: '1em',
        backgroundColor: bgColor,
    }}/>
}

interface RingProps {
    id: string
    size: number
    colors: any
    offset: number
}

const Ring = ({size, colors, id, offset}: RingProps) => {
    const [_colors, _setColors] = useState<Array<Color>>([]);

    useEffect(() => {
        let c: Array<Color> = [];
        for (let i = offset; i < size + offset; i++) {
            c[i] = colors[i.toString()]
        }
        _setColors(c)
    }, [colors, offset, size])

    return <div id={id} className={'ring'}>
        {
            _colors.map((c, idx) => <Light key={`${id}-${idx}`} color={c}/>)
        }
    </div>
}

const createNumberedObj = (size: number) => {
    const obj: any = {};
    for (let i = 0; i < size; i++) {
        obj[i.toString()] = {}
    }
    return obj;
}

function App() {
    const [colors, updateColor] = useState<any>(createNumberedObj(84));

    const colorMap = [
        {red: 255, green: 0, blue: 0},
        {red: 255, green: 127, blue: 0},
        {red: 255, green: 255, blue: 0},

        {red: 127, green: 255, blue: 0},
        {red: 0, green: 255, blue: 0},
        {red: 0, green: 255, blue: 127},

        {red: 0, green: 255, blue: 255},
        {red: 0, green: 127, blue: 255},
        {red: 0, green: 0, blue: 255},

        {red: 127, green: 0, blue: 255},
        {red: 255, green: 0, blue: 255},
        {red: 255, green: 0, blue: 127},
    ]

    useEffect(() => {
        let idx = 0;
        setInterval(() => {
            let clone = {...colors};

            for (let j = 0; j < 12; j++) {
                for (let i = 0; i < 5; i++) {
                    clone[j * 5 + i] = colorMap[j]
                }
                clone[j * 2 + 60] = colorMap[j]
                clone[j * 2 + 1 + 60] = colorMap[j]
            }

            const cloneArr = [];
            for (let i = 0; i < 84; i++) {
                cloneArr.push(clone[i.toString()])
            }

            let small = cloneArr.slice(60, 84);
            for (let i = 0; i < idx; i++) {
                const chunk = small.splice(small.length - 2, 2);
                small = chunk.concat(small)
            }
            for (let i = 0; i < small.length; i++) {
                clone[(i + 60).toString()] = small[i]
            }

            let large = cloneArr.slice(0, 60);
            for (let i = 0; i < idx; i++) {
                const chunk = large.splice(large.length - 5, 5);
                large = chunk.concat(large)
            }
            for (let i = 0; i < large.length; i++) {
                clone[i.toString()] = large[i]
            }

            updateColor(clone)
            idx <= 10 ? idx++ : idx = 0;
        }, 50)

    }, [])

    return (
        <div className="App">
            <div id={"hex"}/>
            <Ring id={'big-ring'} size={60} offset={0} colors={colors}/>
            <Ring id={'little-ring'} size={24} offset={60} colors={colors}/>
        </div>
    );
}

export default App;
