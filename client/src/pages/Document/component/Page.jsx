import React, { useEffect, useRef, useState } from 'react';
import { socket_io } from '../../../Socket/Socket';

const Page = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen');
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const contextRef = useRef(null);
    const urlParams = new URLSearchParams(location.search);
    const docid = urlParams.get('id');

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        contextRef.current = context;

        // Handle incoming draw events
        socket_io.on('drawEvent', (data) => {
            const context = contextRef.current;
            
            // Store original values
            const originalStrokeStyle = context.strokeStyle;
            const originalLineWidth = context.lineWidth;

            // Apply incoming event styles
            if (data.tool === 'eraser') {
                context.strokeStyle = '#FFFFFF'; // White color for eraser
                context.lineWidth = data.lineWidth;
            } else {
                context.strokeStyle = data.color;
                context.lineWidth = data.lineWidth;
            }
            
            // Handle the drawing
            if (data.type === 'start') {
                context.beginPath();
                context.moveTo(data.x, data.y);
            } else if (data.type === 'draw') {
                context.lineTo(data.x, data.y);
                context.stroke();
            }

            // Restore original values
            context.strokeStyle = originalStrokeStyle;
            context.lineWidth = originalLineWidth;
        });

        socket_io.on('canvasCleared', () => {
            clearCanvas();
        });

        return () => {
            socket_io.off('drawEvent');
            socket_io.off('canvasCleared');
        };
    }, []);

    // Update context when color changes
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
        }
    }, [color, tool]);

    // Update context when lineWidth changes
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.lineWidth = lineWidth;
        }
    }, [lineWidth]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const context = contextRef.current;
        
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);

        // Set the correct color based on tool
        if (tool === 'eraser') {
            context.strokeStyle = '#FFFFFF';
        } else {
            context.strokeStyle = color;
        }

        socket_io.emit('draw', {
            type: 'start',
            x: offsetX,
            y: offsetY,
            color: tool === 'eraser' ? '#FFFFFF' : color,
            lineWidth,
            roomId: docid,
            tool
        });
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = nativeEvent;
        const context = contextRef.current;
        
        context.lineTo(offsetX, offsetY);
        context.stroke();

        socket_io.emit('draw', {
            type: 'draw',
            x: offsetX,
            y: offsetY,
            color: tool === 'eraser' ? '#FFFFFF' : color,
            lineWidth,
            roomId: docid,
            tool
        });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        contextRef.current.beginPath(); // Reset the path when stopping
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        if (docid) {
            socket_io.emit('clearCanvas', docid);
        }
    };

    // Initialize canvas with white background
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const handleToolChange = (newTool) => {
        setTool(newTool);
        if (contextRef.current) {
            contextRef.current.strokeStyle = newTool === 'eraser' ? '#FFFFFF' : color;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex gap-4 p-4 bg-gray-100">
                <select 
                    className="px-3 py-1 border rounded"
                    value={tool}
                    onChange={(e) => handleToolChange(e.target.value)}
                >
                    <option value="pen">Pen</option>
                    <option value="eraser">Eraser</option>
                </select>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8"
                    disabled={tool === 'eraser'}
                />
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    className="w-32"
                />
                <button
                    onClick={clearCanvas}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Clear
                </button>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="flex-1 bg-white cursor-crosshair"
            />
        </div>
    );
};

export default Page;