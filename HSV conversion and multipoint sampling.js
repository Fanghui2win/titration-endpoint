// HSV转换与多点采样模块伪代码
function convertToHSV(imageData) {
  const { width, height, data } = imageData;
  const hsvData = {
    width,
    height,
    data: new Array(width * height * 3)
  };
  
  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    // 计算HSV值
    let h, s, v;
    
    // 计算色相H
    if (delta === 0) {
      h = 0;
    } else if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    // 计算饱和度S
    s = max === 0 ? 0 : delta / max;
    
    // 计算明度V
    v = max;
    
    // 存储HSV值
    hsvData.data[j] = h;       // H: 0-360
    hsvData.data[j + 1] = s * 100; // S: 0-100
    hsvData.data[j + 2] = v * 100; // V: 0-100
  }
  
  return hsvData;
}

function multiPointSampling(hsvData) {
  const { width, height, data } = hsvData;
  const samplingPoints = userSettings.sampling.points || 5;
  const samplingResults = [];
  
  // 生成采样点网格
  for (let i = 0; i < samplingPoints; i++) {
    for (let j = 0; j < samplingPoints; j++) {
      const x = Math.floor(width * (i + 0.5) / samplingPoints);
      const y = Math.floor(height * (j + 0.5) / samplingPoints);
      
      // 获取采样点周围区域的HSV值
      const areaSize = userSettings.sampling.areaSize || 5;
      const halfSize = Math.floor(areaSize / 2);
      
      const areaHSV = {h: [], s: [], v: []};
      
      // 收集区域内的HSV值
      for (let dy = -halfSize; dy <= halfSize; dy++) {
        for (let dx = -halfSize; dx <= halfSize; dx++) {
          const px = x + dx;
          const py = y + dy;
          
          if (px >= 0 && px < width && py >= 0 && py < height) {
            const index = (py * width + px) * 3;
            areaHSV.h.push(data[index]);
            areaHSV.s.push(data[index + 1]);
            areaHSV.v.push(data[index + 2]);
          }
        }
      }
      
      // 计算区域平均HSV
      if (areaHSV.h.length > 0) {
        const avgH = areaHSV.h.reduce((sum, val) => sum + val, 0) / areaHSV.h.length;
        const avgS = areaHSV.s.reduce((sum, val) => sum + val, 0) / areaHSV.s.length;
        const avgV = areaHSV.v.reduce((sum, val) => sum + val, 0) / areaHSV.v.length;
        
        samplingResults.push({h: avgH, s: avgS, v: avgV, x, y});
      }
    }
  }
  
  // 可视化采样点
  displaySamplingPoints(samplingResults);
  
  // 返回所有采样点的中位数HSV值(比平均值更鲁棒)
  return {
    h: getMedian(samplingResults.map(p => p.h)),
    s: getMedian(samplingResults.map(p => p.s)),
    v: getMedian(samplingResults.map(p => p.v))
  };
}

function getMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}
