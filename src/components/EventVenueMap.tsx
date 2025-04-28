
import { useRef, useEffect } from "react";
import { FetchmanAllocationResult } from "@/utils/fetchmanCalculator";

interface EventVenueMapProps {
  venueName: string;
  vendorCount: number;
  fetchmanAllocation: FetchmanAllocationResult;
  activeLayer?: 'all' | 'vendors' | 'staff' | 'exits';
}

export default function EventVenueMap({ 
  venueName, 
  vendorCount, 
  fetchmanAllocation,
  activeLayer = 'all'
}: EventVenueMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match display size
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw venue outline
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 10);
    ctx.stroke();

    // Draw floor grid
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 20; x < canvas.width - 20; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, canvas.height - 20);
      ctx.stroke();
    }
    
    for (let y = 20; y < canvas.height - 20; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();
    }

    // Draw venue name
    ctx.fillStyle = '#333';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(venueName, canvas.width / 2, 50);

    // Draw vendor locations if vendor layer is active
    if (activeLayer === 'all' || activeLayer === 'vendors') {
      ctx.fillStyle = '#10b981'; // Green
      const vendorSpacing = (canvas.width - 80) / Math.min(12, vendorCount);
      for (let i = 0; i < Math.min(12, vendorCount); i++) {
        const x = 40 + i * vendorSpacing;
        const y = canvas.height - 80;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Vendor label
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`V${i+1}`, x, y + 20);
        ctx.fillStyle = '#10b981'; // Reset for next vendor
      }
    }

    // Draw entrance and exits if exits layer is active
    if (activeLayer === 'all' || activeLayer === 'exits') {
      // Main entrance
      ctx.fillStyle = '#3b82f6'; // Blue
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 30, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.fillText("Entrance", canvas.width / 2, 60);
      
      // Emergency exits
      ctx.fillStyle = '#ef4444'; // Red
      
      // Left exit
      ctx.beginPath();
      ctx.arc(30, canvas.height / 2, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Right exit
      ctx.beginPath();
      ctx.arc(canvas.width - 30, canvas.height / 2, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Back exit
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 30, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Exit labels
      ctx.fillStyle = '#333';
      ctx.font = '10px sans-serif';
      ctx.fillText("Exit", 30, canvas.height / 2 - 15);
      ctx.fillText("Exit", canvas.width - 30, canvas.height / 2 - 15);
      ctx.fillText("Exit", canvas.width / 2, canvas.height - 45);
    }

    // Draw fetchmen and staff positions if staff layer is active
    if (activeLayer === 'all' || activeLayer === 'staff') {
      // Draw fetchmen
      ctx.fillStyle = '#f59e0b'; // Amber
      const totalFetchmen = fetchmanAllocation.totalFetchmen;
      
      // Position fetchmen around the venue
      const fetchmenPerSide = Math.ceil(totalFetchmen / 4);
      let fetchmenDrawn = 0;
      
      // Top side fetchmen
      for (let i = 0; i < Math.min(fetchmenPerSide, totalFetchmen - fetchmenDrawn); i++) {
        const x = canvas.width / 4 + i * (canvas.width / 2) / fetchmenPerSide;
        const y = 80;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        fetchmenDrawn++;
      }
      
      // Right side fetchmen
      for (let i = 0; i < Math.min(fetchmenPerSide, totalFetchmen - fetchmenDrawn); i++) {
        const x = canvas.width - 80;
        const y = canvas.height / 4 + i * (canvas.height / 2) / fetchmenPerSide;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        fetchmenDrawn++;
      }
      
      // Bottom side fetchmen
      for (let i = 0; i < Math.min(fetchmenPerSide, totalFetchmen - fetchmenDrawn); i++) {
        const x = canvas.width / 4 + i * (canvas.width / 2) / fetchmenPerSide;
        const y = canvas.height - 80;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        fetchmenDrawn++;
      }
      
      // Left side fetchmen
      for (let i = 0; i < Math.min(fetchmenPerSide, totalFetchmen - fetchmenDrawn); i++) {
        const x = 80;
        const y = canvas.height / 4 + i * (canvas.height / 2) / fetchmenPerSide;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        fetchmenDrawn++;
      }
      
      // Draw security staff
      ctx.fillStyle = '#8b5cf6'; // Purple
      for (let i = 0; i < fetchmanAllocation.securityStaff; i++) {
        const angle = (i / fetchmanAllocation.securityStaff) * 2 * Math.PI;
        const radius = Math.min(canvas.width, canvas.height) * 0.35;
        const x = canvas.width / 2 + radius * Math.cos(angle);
        const y = canvas.height / 2 + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw other venue features
    if (activeLayer === 'all') {
      // Main stage or central area
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // Light blue
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, canvas.width / 4, canvas.height / 6, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.fillText("Main Area", canvas.width / 2, canvas.height / 2);
      
      // Restrooms
      ctx.fillStyle = 'rgba(236, 72, 153, 0.2)'; // Light pink
      ctx.beginPath();
      ctx.rect(50, 50, 60, 30);
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.font = '10px sans-serif';
      ctx.fillText("Restrooms", 80, 70);
      
      // First aid
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'; // Light green
      ctx.beginPath();
      ctx.rect(canvas.width - 110, 50, 60, 30);
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.font = '10px sans-serif';
      ctx.fillText("First Aid", canvas.width - 80, 70);
    }

    // Legend at bottom
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${vendorCount} Vendors | ${fetchmanAllocation.totalFetchmen} Fetchmen | ${fetchmanAllocation.securityStaff} Security`, 30, canvas.height - 10);

  }, [venueName, vendorCount, fetchmanAllocation, activeLayer]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    ></canvas>
  );
}
