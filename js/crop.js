/**
 * Cropper module — wraps Cropper.js for image cropping with 1:1 aspect ratio.
 */
const CropManager = (() => {
  let cropper = null;
  let onChangeCallback = null;

  /**
   * Initialize the cropper on an image element.
   * @param {HTMLImageElement} imgElement
   * @param {function} onChange - Called when crop area changes
   */
  function init(imgElement, onChange) {
    destroy();
    onChangeCallback = onChange;

    cropper = new Cropper(imgElement, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      cropBoxResizable: true,
      cropBoxMovable: true,
      background: false,
      responsive: true,
      ready() {
        triggerChange();
      },
      crop() {
        triggerChange();
      },
    });
  }

  function triggerChange() {
    if (!cropper || !onChangeCallback) return;
    // Debounce preview updates
    clearTimeout(triggerChange._timer);
    triggerChange._timer = setTimeout(() => {
      const canvas = cropper.getCroppedCanvas({
        width: PalestineBorder.OUTPUT_SIZE,
        height: PalestineBorder.OUTPUT_SIZE,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      if (canvas) onChangeCallback(canvas);
    }, 50);
  }

  /**
   * Get the cropped image as a canvas.
   * @returns {HTMLCanvasElement|null}
   */
  function getCroppedCanvas() {
    if (!cropper) return null;
    return cropper.getCroppedCanvas({
      width: PalestineBorder.OUTPUT_SIZE,
      height: PalestineBorder.OUTPUT_SIZE,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
  }

  function destroy() {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }

  return { init, getCroppedCanvas, destroy };
})();
