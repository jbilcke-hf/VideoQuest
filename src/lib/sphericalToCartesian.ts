function sphericalToCartesian(yaw: number, pitch: number, width: number, height: number): { x: number, y: number } {
  const x = ((yaw + 180) / 360) * width;
  const y = ((pitch + 90) / 180) * height;

  return { x, y };
}