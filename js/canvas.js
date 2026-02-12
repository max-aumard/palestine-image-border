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

  // Arc segments centered on cardinal directions (like the actual flag)
  // Black = top, White = right, Green = bottom, Red = left
  const SEGMENTS = [
    { color: COLORS.black, start: -3 * Math.PI / 4, end: -Math.PI / 4 },   // top
    { color: COLORS.white, start: -Math.PI / 4,      end: Math.PI / 4 },    // right
    { color: COLORS.green, start: Math.PI / 4,        end: 3 * Math.PI / 4 }, // bottom
    { color: COLORS.red,   start: 3 * Math.PI / 4,    end: 5 * Math.PI / 4 }, // left
  ];

  const OUTPUT_SIZE = 1000;

  /**
   * Render the final image with Palestine border.
   * @param {HTMLImageElement|HTMLCanvasElement} image - The user's cropped image
   * @param {object} options
   * @param {number} options.borderPercent - Border width as percentage (1-30)
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
      ctx.arc(center, center, innerRadius - 0.5, 0, Math.PI * 2);
    } else {
      const cornerRadius = innerRadius * 0.12;
      roundedRect(ctx, borderWidth + 0.5, borderWidth + 0.5, innerRadius * 2 - 1, innerRadius * 2 - 1, cornerRadius);
    }
    ctx.closePath();
    ctx.clip();

    const imgSize = innerRadius * 2;
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

    // Clip regions use diagonal splits (top-left to bottom-right, top-right to bottom-left)
    // to match the circular layout: Black=top, White=right, Green=bottom, Red=left

    const quadrants = [
      { color: COLORS.black, clip: [[0, 0], [size, 0], [center, center]] },       // top
      { color: COLORS.white, clip: [[size, 0], [size, size], [center, center]] },  // right
      { color: COLORS.green, clip: [[size, size], [0, size], [center, center]] },  // bottom
      { color: COLORS.red,   clip: [[0, size], [0, 0], [center, center]] },        // left
    ];

    for (const q of quadrants) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(q.clip[0][0], q.clip[0][1]);
      ctx.lineTo(q.clip[1][0], q.clip[1][1]);
      ctx.lineTo(q.clip[2][0], q.clip[2][1]);
      ctx.closePath();
      ctx.clip();

      ctx.beginPath();
      roundedRect(ctx, 0, 0, size, size, outerCorner);
      ctx.fillStyle = q.color;
      ctx.fill();

      ctx.beginPath();
      roundedRect(ctx, borderWidth, borderWidth, innerRadius * 2, innerRadius * 2, innerCorner);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill();
      ctx.restore();
    }

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
   */
  function exportPNG(image, options) {
    const canvas = render(image, options);
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
  }

  return { render, exportPNG, OUTPUT_SIZE };
})();
