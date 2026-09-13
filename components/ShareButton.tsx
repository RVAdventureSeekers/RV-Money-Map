"use client";

type ShareButtonProps = {
  goalName: string;
  dayNumber: number;
  totalDays: number;
  netSoFar: number;
};

export default function ShareButton({
  goalName,
  dayNumber,
  totalDays,
  netSoFar,
}: ShareButtonProps) {
  function generateImage() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#FBFAF7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Card
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#EAE4D4";
    ctx.lineWidth = 2;
    roundRect(ctx, 80, 240, 920, 600, 24);
    ctx.fill();
    ctx.stroke();

    // Goal name
    ctx.fillStyle = "#3A3B35";
    ctx.font = "36px Inter, sans-serif";
    ctx.fillText(goalName, 140, 340);

    // Day counter
    ctx.fillStyle = "#1F6E56";
    ctx.font = "500 44px Inter, sans-serif";
    ctx.fillText(`Day ${dayNumber} of ${totalDays}`, 140, 400);

    // Progress bar track
    const pct = Math.min(1, Math.max(0, dayNumber / totalDays));
    ctx.fillStyle = "#F5F2EA";
    roundRect(ctx, 140, 440, 800, 24, 12);
    ctx.fill();

    // Progress bar fill
    ctx.fillStyle = "#1F6E56";
    roundRect(ctx, 140, 440, 800 * pct, 24, 12);
    ctx.fill();

    // Net so far, big number
    ctx.fillStyle = "#20211D";
    ctx.font = "500 88px Inter, sans-serif";
    const netLabel = netSoFar.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    ctx.fillText(netLabel, 140, 620);

    ctx.fillStyle = "#3A3B35";
    ctx.font = "28px Inter, sans-serif";
    ctx.fillText("Net progress toward debt-free", 140, 670);

    // Footer
    ctx.fillStyle = "#888780";
    ctx.font = "24px Inter, sans-serif";
    ctx.fillText("Tracked with RV Money Map", 140, 780);

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `rv-money-map-day-${dayNumber}.png`;
    link.click();
  }

  return (
    <button className="btn-secondary w-full" onClick={generateImage}>
      Share progress
    </button>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
