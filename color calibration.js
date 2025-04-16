// 颜色校正与分析模块伪代码
function colorCorrection(hsv) {
  // 如果有参考色卡，应用校正
  if (userSettings.colorCard && userSettings.colorCard.enabled) {
    const referenceHSV = userSettings.colorCard.referenceHSV;
    const measuredHSV = userSettings.colorCard.measuredHSV;
    
    // 计算校正因子
    const hCorrection = referenceHSV.h / measuredHSV.h;
    const sCorrection = referenceHSV.s / measuredHSV.s;
    const vCorrection = referenceHSV.v / measuredHSV.v;
    
    // 应用校正
    return {
      h: Math.min(360, Math.max(0, hsv.h * hCorrection)),
      s: Math.min(100, Math.max(0, hsv.s * sCorrection)),
      v: Math.min(100, Math.max(0, hsv.v * vCorrection))
    };
  }
  
  // 没有色卡校正，返回原始HSV
  return hsv;
}

function analyzeColor(hsv) {
  // 获取当前选择的滴定类型
  const titrationType = userSettings.titration.type;
  const indicatorType = userSettings.titration.indicator;
  
  // 获取参考HSV值
  const referenceHSV = hsvDatabase[titrationType][indicatorType];
  
  if (!referenceHSV) {
    showMessage('未找到所选滴定类型的参考值');
    return;
  }
  
  // 计算HSV差异
  const hDiff = calculateHueDifference(hsv.h, referenceHSV.h);
  const sDiff = Math.abs(hsv.s - referenceHSV.s);
  const vDiff = Math.abs(hsv.v - referenceHSV.v);
  
  // 判断是否达到终点
  const hThreshold = referenceHSV.hTolerance || 10;
  const sThreshold = referenceHSV.sTolerance || 10;
  const vThreshold = referenceHSV.vTolerance || 10;
  
  const isEndpoint = 
    hDiff <= hThreshold && 
    sDiff <= sThreshold && 
    vDiff <= vThreshold;
  
  // 计算匹配度百分比
  const matchPercentage = calculateMatchPercentage(
    hDiff, sDiff, vDiff,
    hThreshold, sThreshold, vThreshold
  );
  
  // 更新UI
  updateColorAnalysisUI(hsv, referenceHSV, matchPercentage, isEndpoint);
  
  // 如果达到终点，触发提示
  if (isEndpoint) {
    triggerEndpointNotification();
  }
  
  // 记录历史数据点
  recordDataPoint(hsv, matchPercentage, isEndpoint);
}

function calculateHueDifference(h1, h2) {
  // 特殊处理色相环上的差异
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
}

function calculateMatchPercentage(hDiff, sDiff, vDiff, hThreshold, sThreshold, vThreshold) {
  // 将各分量差异转换为0-100的百分比
  const hMatch = 100 - Math.min(100, (hDiff / hThreshold) * 100);
  const sMatch = 100 - Math.min(100, (sDiff / sThreshold) * 100);
  const vMatch = 100 - Math.min(100, (vDiff / vThreshold) * 100);
  
  // 加权平均，色相权重更高
  return 0.5 * hMatch + 0.25 * sMatch + 0.25 * vMatch;
}
