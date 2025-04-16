// HSV参考数据库
const hsvDatabase = {
  'acid-base': {
    'phenolphthalein': {
      h: 340,
      s: 30,
      v: 90,
      hTolerance: 10,
      sTolerance: 10,
      vTolerance: 5,
      description: '无色→粉红色',
      phRange: '8.2-10.0'
    },
    'methyl-orange': {
      h: 60,
      s: 90,
      v: 95,
      hTolerance: 10,
      sTolerance: 10,
      vTolerance: 5,
      description: '红色→黄色',
      phRange: '3.1-4.4'
    },
    'bromothymol-blue': {
      h: 210,
      s: 80,
      v: 70,
      hTolerance: 10,
      sTolerance: 10,
      vTolerance: 10,
      description: '黄色→蓝色',
      phRange: '6.0-7.6'
    }
  },
  'redox': {
    'potassium-permanganate': {
      h: 310,
      s: 60,
      v: 80,
      hTolerance: 10,
      sTolerance: 10,
      vTolerance: 10,
      description: '无色→粉红色'
    },
    'starch-iodine': {
      h: 230,
      s: 90,
      v: 50,
      hTolerance: 10,
      sTolerance: 10,
      vTolerance: 10,
      description: '无色→蓝色'
    }
  },
  'complexometric': {
    'eriochrome-black-t': {
      h: 240,
      s: 80,
      v: 60,
      hTolerance: 10,
      sTolerance: 10,
      vTolerance: 10,
      description: '葡萄酒红→蓝色'
    },
    'calcon': {
      h: 240,
      s: 70,
      v: 70,
      hTolerance: 15,
      sTolerance: 15,
      vTolerance: 10,
      description: '红色→蓝色'
    }
  },
  'precipitation': {
    'potassium-chromate': {
      h: 20,
      s: 80,
      v: 70,
      hTolerance: 10,
      sTolerance: 10,
      vTolerance: 10,
      description: '黄色→红棕色'
    }
  }
};
