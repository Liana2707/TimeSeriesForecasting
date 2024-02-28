import React, { useState } from 'react';
import { Input, TextField, Button } from '@mui/material';
import Title from '../components/Title';

const VectorInput = ({ handleChange, name }) => {
    const [length, setLength] = useState('');
    const width = 1
    const [matrix, setMatrix] = useState([]);

    const handleLengthChange = (e) => {
        setLength(e.target.value);
    };

    const handleMatrixInputChange = (i, j, value) => {
        const updatedMatrix = [...matrix];
        updatedMatrix[i] = updatedMatrix[i] || [];
        updatedMatrix[i][j] = value;
        setMatrix(updatedMatrix);
    };

    const renderMatrixInput = () => {
        const rows = parseInt(length, 10) || 0;
        const cols = parseInt(width, 10) || 0;

        const matrixInputs = [];

        for (let i = 0; i < rows; i++) {
            const rowInputs = [];
            for (let j = 0; j < cols; j++) {
                rowInputs.push(
                    <div style={{ width: '70px' }}>
                        <TextField
                            key={`input-${i}-${j}`}
                            type="text"
                            placeholder={`a${i + 1}${j + 1}`}
                            value={matrix[i]?.[j] || ''}
                            onChange={(e) => handleMatrixInputChange(i, j, e.target.value)}
                        />
                    </div>
                );
            }
            matrixInputs.push(
                <div style={{ display: 'flex' }} key={`row-${i}`} className="matrix-row">
                    {rowInputs}
                </div>
            );
        }

        return <div className="matrix">{matrixInputs}</div>;
    };

    const handleSubmit = (e) => {
        handleChange({
            ...e,
            target: {
                ...e.target,
                name: name,
                value: matrix
            },
        })
    };

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <Title>Вектор: {name}</Title>
            </div>
            <div style={{ display: 'flex' }}>
                <div>Длина вектора:</div>
                <div style={{ width: '70px', marginLeft: '10px' }}>
                    <Input type="number" value={length} onChange={handleLengthChange} />
                </div>
            </div>

            {renderMatrixInput()}

            <Button variant='outlined' onClick={handleSubmit}>Сохранить вектор</Button>
        </div>
    );
};

export default VectorInput;