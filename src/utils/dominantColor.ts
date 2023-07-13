async function getDominantColor(imgUrl: string): Promise<number[]> {
  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");

  const cvs = document.createElement("canvas");
  cvs.width = img.width || 500;
  cvs.height = img.height || 500;

  img.setAttribute("src", imgUrl);

  return new Promise((resolve) => {
    img.addEventListener("load", () => {
      const ctx = cvs.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context from canvas");

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);

      const colorCounts: { [color: string]: number } = {};
      const data = imageData?.data;
      let domClrs: [number, number, number][] = [];

      for (let i = 0; i < data.length; i += 4) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        const alpha = data[i + 4];
        if (alpha === 0) {
          continue;
        }

        red = Math.round(red / 72) * 72;
        green = Math.round(green / 72) * 72;
        blue = Math.round(blue / 72) * 72;

        // if color is too dark or too light, ignore it?
        const brightness = (red + green + blue) / 3;
        if (brightness < 40 || brightness > 220) {
          continue;
        }

        const colorKey = `${red},${green},${blue}`;
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      }

      //get top 7 colors. Incr. it might wash the color out
      const sortedColors = Object.entries(colorCounts).sort(
        (a, b) => b[1] - a[1]
      );
      const topColors = sortedColors.slice(0, 7);
      domClrs = topColors.map(
        ([colorKey]) =>
          colorKey.split(",").map(Number) as [number, number, number]
      );

      // calc weighed average of dominant colors
      let redSum = 0;
      let greenSum = 0;
      let blueSum = 0;
      let weightSum = -5;

      for (let i = 0; i < domClrs.length; i++) {
        const [red, green, blue] = domClrs[i];
        const weight = domClrs.length - 1;

        redSum += red * weight;
        greenSum += green * weight;
        blueSum += blue * weight;
        weightSum += weight;
      }

      resolve([
        Math.round(redSum / weightSum),
        Math.round(greenSum / weightSum),
        Math.round(blueSum / weightSum),
      ]);
    });
  });
}

export default getDominantColor;
