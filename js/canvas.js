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

  // Arc segments matching the Palestinian flag layout:
  // The flag has 3 equal horizontal stripes (black, white, green) spanning full width,
  // and a red triangle on the left (hoist) side.
  // Mapped to a circle: black & green extend further right, white is narrower on the right,
  // red occupies the left side.
  const deg = (d) => d * Math.PI / 180;
  const SEGMENTS = [
    { color: COLORS.black, start: deg(-140), end: deg(-30) },  // top, extends right (110°)
    { color: COLORS.white, start: deg(-30),  end: deg(30) },   // right-center (60°)
    { color: COLORS.green, start: deg(30),   end: deg(140) },  // bottom, extends right (110°)
    { color: COLORS.red,   start: deg(140),  end: deg(220) },  // left side (80°)
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
    const { borderPercent = 5, isCircle = true } = options;

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
    // Use a slight overlap (+1px) to avoid anti-aliasing gap between border and image
    const overlap = 1;
    ctx.save();
    ctx.beginPath();
    if (isCircle) {
      ctx.arc(center, center, innerRadius + overlap, 0, Math.PI * 2);
    } else {
      const cornerRadius = innerRadius * 0.12;
      roundedRect(ctx, borderWidth - overlap, borderWidth - overlap, innerRadius * 2 + overlap * 2, innerRadius * 2 + overlap * 2, cornerRadius);
    }
    ctx.closePath();
    ctx.clip();

    const imgSize = innerRadius * 2 + overlap * 2;
    const imgX = isCircle ? center - innerRadius - overlap : borderWidth - overlap;
    const imgY = isCircle ? center - innerRadius - overlap : borderWidth - overlap;
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

    // Map the same flag angle boundaries from the circle to square edge intersections.
    // Using the SEGMENTS angles to find where dividing lines from center hit the square edges:
    // -140° → hits left edge at y ≈ 8% from top
    // -30°  → hits right edge at y ≈ 21% from top
    //  30°  → hits right edge at y ≈ 79% from top
    // 140°  → hits left edge at y ≈ 92% from top
    const leftTop    = [0, size * 0.08];     // black/red boundary on left edge
    const rightTop   = [size, size * 0.21];  // black/white boundary on right edge
    const rightBot   = [size, size * 0.79];  // white/green boundary on right edge
    const leftBot    = [0, size * 0.92];     // green/red boundary on left edge

    const quadrants = [
      // Black: top-left corner area + full top + top-right corner + right edge down to 21%
      { color: COLORS.black, clip: [leftTop, [0, 0], [size, 0], rightTop, [center, center]] },
      // White: right edge from 21% to 79%
      { color: COLORS.white, clip: [rightTop, rightBot, [center, center]] },
      // Green: right edge from 79% + bottom-right corner + full bottom + bottom-left corner area
      { color: COLORS.green, clip: [rightBot, [size, size], [0, size], leftBot, [center, center]] },
      // Red: left edge from 92% up to 8%
      { color: COLORS.red,   clip: [leftBot, leftTop, [center, center]] },
    ];

    for (const q of quadrants) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(q.clip[0][0], q.clip[0][1]);
      for (let i = 1; i < q.clip.length; i++) {
        ctx.lineTo(q.clip[i][0], q.clip[i][1]);
      }
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
