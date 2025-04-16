// 图像预处理模块伪代码
function processImage(imageData) {
  // 1. 裁剪感兴趣区域(ROI)
  const roi = cropROI(imageData);
  
  // 2. 图像增强
  const enhancedImage = enhanceImage(roi);
  
  // 3. 转换为HSV
  const hsvData = convertToHSV(enhancedImage);
  
  // 4. 多点采样
  const sampledHSV = multiPointSampling(hsvData);
  
  // 5. 颜色校正
  const correctedHSV = colorCorrection(sampledHSV);
  
  // 6. 分析颜色并判断终点
  analyzeColor(correctedHSV);
}

function cropROI(imageData) {
  // 根据用户设置的ROI区域裁剪图像
  const { width, height, data } = imageData;
  const roiSettings = userSettings.roi;
  
  // 默认使用中心区域
  const centerX = width / 2;
  const centerY = height / 2;
  const roiSize = roiSettings.size || Math.min(width, height) / 3;
  
  const startX = Math.max(0, centerX - roiSize / 2);
  const startY = Math.max(0, centerY - roiSize / 2);
  const endX = Math.min(width, centerX + roiSize / 2);
  const endY = Math.min(height, centerY + roiSize / 2);
  
  // 创建ROI数据
  const roi = {
    width: endX - startX,
    height: endY - startY,
    data: new Uint8ClampedArray((endX - startX) * (endY - startY) * 4)
  };
  
  // 复制ROI数据
  let index = 0;
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const srcIndex = (y * width + x) * 4;
      roi.data[index++] = imageData.data[srcIndex];     // R
      roi.data[index++] = imageData.data[srcIndex + 1]; // G
      roi.data[index++] = imageData.data[srcIndex + 2]; // B
      roi.data[index++] = imageData.data[srcIndex + 3]; // A
    }
  }
  
  // 显示ROI区域
  displayROI(roi);
  
  return roi;
}

function enhanceImage(imageData) {
  // 图像增强处理
  const { width, height, data } = imageData;
  const enhanced = {
    width,
    height,
    data: new Uint8ClampedArray(data)
  };
  
  // 对比度增强
  const factor = userSettings.enhancement.contrastFactor || 1.2;
  const brightness = userSettings.enhancement.brightness || 0;
  
  for (let i = 0; i < data.length; i += 4) {
    // 对RGB通道应用对比度和亮度调整
    for (let j = 0; j < 3; j++) {
      let val = data[i + j];
      val = factor * (val - 128) + 128 + brightness;
      enhanced.data[i + j] = Math.max(0, Math.min(255, val));
    }
  }
  
  // 显示增强后的图像
  displayEnhancedImage(enhanced);
  
  return enhanced;
}
