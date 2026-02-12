/**
 * Canvas rendering module — draws the Palestine flag border and composites the user's image.
 */
const PalestineBorder = (() => {
  const COLORS = {
    black: '#000000',
    white: '#FFFFFF',
    green: '#009736',
    red: '#CE1126',
  };

  // Arc segments (in radians, clockwise from top)
  // The flag layout: Black top-right, White right-bottom, Green bottom-left, Red left-top
  const SEGMENTS = [
    { color: COLORS.black, start: -Math.PI / 2, end: 0 },
    { color: COLORS.white, start: 0, end: Math.PI / 2 },
    { color: COLORS.green, start: Math.PI / 2, end: Math.PI },
    { color: COLORS.red, start: Math.PI, end: 3 * Math.PI / 2 },
  ];

  const OUTPUT_SIZE = 1000;

  /**
   * Render the final image with Palestine border.
   * @param {HTMLImageElement|HTMLCanvasElement} image - The user's cropped image
   * @param {object} options
   * @param {number} options.borderPercent - Border width as percentage (5-30)
   * @param {boolean} options.isCircle - true for circle, false for rounded square
   * @param {HTMLCanvasElement} [targetCanvas] - Optional canvas to draw on (for preview)
   * @returns {HTMLCanvasElement}
   */
  function render(image, options, targetCanvas) {
    const { borderPercent = 12, isCircle = true } = options;

    const canvas = targetCanvas || document.createElement('canvas');
    const size = targetCanvas ? targetCanvas.width : OUTPUT_SIZE;
    if (!targetCanvas) {
      canvas.width = size;
      canvas.height = size;
    }

    const ctx = canvas.getContext('2d');
    const center = size / 2;
    const outerRadius = size / 2;
    const borderWidth = (borderPercent / 100) * size;
    const innerRadius = outerRadius - borderWidth;

    // Clear
    ctx.clearRect(0, 0, size, size);

    if (isCircle) {
      drawCircleBorder(ctx, center, outerRadius, innerRadius);
    } else {
      drawSquareBorder(ctx, size, borderWidth, innerRadius);
    }

    // Draw the user image clipped inside the inner area
    ctx.save();
    ctx.beginPath();
    if (isCircle) {
      ctx.arc(center, center, innerRadius - 1, 0, Math.PI * 2);
    } else {
      const cornerRadius = innerRadius * 0.12;
      roundedRect(ctx, borderWidth, borderWidth, innerRadius * 2, innerRadius * 2, cornerRadius);
    }
    ctx.closePath();
    ctx.clip();

    // Draw image to fill the clipped area
    const imgSize = isCircle ? innerRadius * 2 : innerRadius * 2;
    const imgX = isCircle ? center - innerRadius : borderWidth;
    const imgY = isCircle ? center - innerRadius : borderWidth;
    ctx.drawImage(image, imgX, imgY, imgSize, imgSize);
    ctx.restore();

    return canvas;
  }

  function drawCircleBorder(ctx, center, outerRadius, innerRadius) {
    for (const seg of SEGMENTS) {
      ctx.beginPath();
      ctx.arc(center, center, outerRadius, seg.start, seg.end);
      ctx.arc(center, center, innerRadius, seg.end, seg.start, true);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
    }
  }

  function drawSquareBorder(ctx, size, borderWidth, innerRadius) {
    const center = size / 2;
    const outerCorner = size * 0.08;
    const innerCorner = innerRadius * 0.12;

    // Draw each quadrant of the square border
    // Top-right: Black
    ctx.save();
    ctx.beginPath();
    ctx.rect(center, 0, center, center);
    ctx.clip();
    ctx.beginPath();
    roundedRect(ctx, 0, 0, size, size, outerCorner);
    ctx.fillStyle = COLORS.black;
    ctx.fill();
    ctx.beginPath();
    roundedRect(ctx, borderWidth, borderWidth, innerRadius * 2, innerRadius * 2, innerCorner);
    ctx.fillStyle = 'white'; // will be clipped away
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.restore();

    // Bottom-right: White
    ctx.save();
    ctx.beginPath();
    ctx.rect(center, center, center, center);
    ctx.clip();
    ctx.beginPath();
    roundedRect(ctx, 0, 0, size, size, outerCorner);
    ctx.fillStyle = COLORS.white;
    ctx.fill();
    ctx.beginPath();
    roundedRect(ctx, borderWidth, borderWidth, innerRadius * 2, innerRadius * 2, innerCorner);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.restore();

    // Bottom-left: Green
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, center, center, center);
    ctx.clip();
    ctx.beginPath();
    roundedRect(ctx, 0, 0, size, size, outerCorner);
    ctx.fillStyle = COLORS.green;
    ctx.fill();
    ctx.beginPath();
    roundedRect(ctx, borderWidth, borderWidth, innerRadius * 2, innerRadius * 2, innerCorner);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.restore();

    // Top-left: Red
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, center, center);
    ctx.clip();
    ctx.beginPath();
    roundedRect(ctx, 0, 0, size, size, outerCorner);
    ctx.fillStyle = COLORS.red;
    ctx.fill();
    ctx.beginPath();
    roundedRect(ctx, borderWidth, borderWidth, innerRadius * 2, innerRadius * 2, innerCorner);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.restore();

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }

  function roundedRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  /**
   * Export canvas as PNG blob.
   * @param {HTMLImageElement|HTMLCanvasElement} image
   * @param {object} options
   * @returns {Promise<Blob>}
   */
  function exportPNG(image, options) {
    const canvas = render(image, options);
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
  }

  return { render, exportPNG, OUTPUT_SIZE };
})();
