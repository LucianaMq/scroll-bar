import {Component, OnDestroy, OnInit} from '@angular/core';
import * as barCharts from 'echarts';
import {ScrollBarService} from "./scroll-bar.service";
import {ScaleOption, ScaleResult} from "./scroll-bar.module";

@Component({
  selector: 'app-scroll-bar',
  templateUrl: './scroll-bar.component.html',
  styleUrls: ['./scroll-bar.component.css']
})
export class ScrollBarComponent implements OnInit, OnDestroy {
  maxDecimal = 15; // 双精度浮点数有效数字为15位
  barData = [];
  barInstance: any;
  barWidth = 30;
  chartCurrentIndex = 0; // 当前数据的index
  fixedIndex = 7; // 一屏数据的个数
  maxIndex = 0;
  page = 1;
  maxPage = 1;
  moveInterval = 10;
  timer;
  barOption = {
    title: {
      text: '年末人口总量(万人)',
      subtext: '数据来自网络'
    },
    legend: {
      show: true,
      data: ['男性人口(万人)', '女性人口(万人)']
    },
    tooltip: {
      show: false
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      top: '12%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisTick: {
          show: false,
        },
        axisLine: {       // 坐标轴 轴线
          show: true,  // 是否显示
          // ------   线 ---------
          lineStyle: {
            color: '#C1C1C1',
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: { // 坐标轴刻度标签
          color: '#454754',
          fontSize: 16,
          interval: 0,
        },
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitNumber: 10,
        nameTextStyle: {   // 坐标轴名称样式
          color: '#6D6B6B',
        },
        axisLine: {    // 坐标轴 轴线
          show: false,  // 是否显示
          // ----- 线 -------
          lineStyle: {
            color: '#C1C1C1',
            width: 1,
            type: 'solid'
          }
        },
        axisTick: {      // 坐标轴的刻度
          show: false,    // 是否显示
        },
        splitLine: { // grid 区域中的分隔线
          lineStyle: {
            width: 2,
            color: '#F3F3F3',
          }
        }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        startValue: 0,
        endValue: this.chartCurrentIndex + this.fixedIndex,
        zoomLock: true
      }
    ],
    series: [
      {
        type: 'bar',
        name: '男性人口(万人)',
        barWidth: this.barWidth,
        label: { // 图形上的文本标签
          show: true,
          position: 'outside',
          color: '#454754',
          fontSize: 14
        },
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#45D9F2' // 0% 处的颜色
              }, {
                offset: 1, color: '#21B1E0' // 100% 处的颜色
              }]
            }
          },
        },
        data: []
      }, {
        type: 'bar',
        name: '女性人口(万人)',
        barWidth: this.barWidth,
        label: { // 图形上的文本标签
          show: true,
          position: 'outside',
          color: '#454754',
          fontSize: 14
        },
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#2BF0BB' // 0% 处的颜色
              }, {
                offset: 1, color: '#13DC86' // 100% 处的颜色
              }]
            }
          },
        },
        data: []
      }
    ]
  };

  constructor(
    private service: ScrollBarService,
  ) {
  }

  ngOnInit() {
    this.service.getBarData().subscribe(res => {
      this.barData = res.datalist;
    })
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  clearTimer() {
    if (this.timer) clearInterval(this.timer);
  }

  barInit(ec: any) {
    this.barInstance = ec;
    this.getData();
  }

  getData() {
    this.chartCurrentIndex = 0;
    this.page = 1;
    this.maxPage = Math.ceil(this.barData.length / this.fixedIndex);
    this.maxIndex = this.barData.length;
    const labelData = [];
    const maleData = [];
    const femaleData = [];
    this.barData.forEach((item) => {
      labelData.push(item.name);
      maleData.push(item.male);
      femaleData.push(item.female);
    });
    this.calcData([...maleData, ...femaleData]);
    this.barOption.xAxis[0].data = labelData;
    this.barOption.series[0].data = maleData;
    this.barOption.series[1].data = femaleData;
    if (this.barInstance) {
      this.barInstance.clear();
      this.barInstance.setOption(this.barOption, true);
    }
    if (this.barData.length > this.fixedIndex + 1) {
      this.fun();
    }
  }

  calcData(data) {
    data.sort((a, b) => a - b);
    if (data.length) {
      let line = this.scaleCompute({
        max: Number(data[data.length - 1]),
        min: Number(data[0]),
        splitNumber: 10, // splitNumber建议取4或者5等这种容易被整除的数字
        symmetrical: false,
        deviation: true,
        preferZero: true,
      });
      this.barOption.yAxis[0] = {
        ...this.barOption.yAxis[0],
        ...line
      };
    }
  }

  fun() {
    this.timer = setInterval(() => {
      if (this.page >= this.maxPage) {
        this.page = 1;
      } else {
        this.page++;
      }
      let start = (this.page - 1) * this.fixedIndex + (this.page - 1);
      let end = this.page * this.fixedIndex + (this.page - 1);
      this.chartMoveX(start, end);
    }, this.moveInterval * 1000);
  }

  toNext(is_next = true) {
    if (is_next && this.page < this.maxPage) {
      this.page++;
      this.handleNext();
    } else if (!is_next && this.page !== 1) {
      this.page--;
      this.handleNext();
    } else {
      return
    }
  }

  handleNext() {
    clearInterval(this.timer);
    let start = (this.page - 1) * this.fixedIndex + (this.page - 1);
    let end = this.page * this.fixedIndex + (this.page - 1);
    this.chartMoveX(start, end);
  }

  chartMoveX(start, end) {
    this.barInstance.dispatchAction({
      type: 'dataZoom',
      startValue: start,
      endValue: end
    });
    if (end >= this.maxIndex) {
      this.chartCurrentIndex = 0;
    } else {
      this.chartCurrentIndex = end + 1;
    }
  }

  /**
   * 解决js的浮点数存在精度问题，在计算出最后结果时可以四舍五入一次，刻度太小也没有意义
   *
   * @export
   * @param {(number | string)} num
   * @param {number} [decimal=8]
   * @returns {number}
   */
  fixedNum(num: number | string, decimal: number = this.maxDecimal): number {
    let str: string = '' + num;
    if (str.indexOf('.') >= 0) {
      str = Number.parseFloat(str).toFixed(decimal);
    }
    return Number.parseFloat(str);
  }

  /**
   * 判断非Infinity非NaN的number
   *
   * @export
   * @param {*} num
   * @returns {num is number}
   */
  numberValid(num: any): boolean {
    return typeof num === 'number' && Number.isFinite(num);
  }

  /**
   * 计算理想的刻度值，刻度区间大小一般是[10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100]中某个数字的整10倍
   *
   * @export
   * @param {ScaleOption} option
   * @returns {ScaleResult}
   */
  scaleCompute(options: ScaleOption): ScaleResult {
    let option = {
      max: null,
      min: null,
      splitNumber: 4, // splitNumber建议取4或者5等这种容易被整除的数字
      symmetrical: false,
      deviation: false,
      preferZero: true,
      ...options,
    };
    const magics: number[] = [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 150]; // 加入150形成闭环
    // tslint:disable-next-line: prefer-const
    let {max: dataMax, min: dataMin, splitNumber, symmetrical, deviation, preferZero} = option;
    if (!this.numberValid(dataMax) || !this.numberValid(dataMin) || dataMax < dataMin) {
      return {splitNumber};
    } else if (dataMax === dataMin && dataMax === 0) {
      return {
        max: this.fixedNum(magics[0] * splitNumber),
        min: dataMin,
        interval: magics[0],
        splitNumber,
      };
    } else if (dataMax === dataMin) {
      preferZero = true;
    }
    if (!this.numberValid(splitNumber) || splitNumber <= 0) {
      splitNumber = 4;
    }
    if (preferZero && dataMax * dataMin > 0) {
      if (dataMax < 0) {
        dataMax = 0;
      } else {
        dataMin = 0;
      }
    }
    const tempGap: number = (dataMax - dataMin) / splitNumber;
    let multiple: number = Math.floor(Math.log10(tempGap) - 1); // 指数
    multiple = Math.pow(10, multiple);
    const tempStep: number = tempGap / multiple;
    let expectedStep: number = magics[0] * multiple;
    let storedMagicsIndex: number = -1;
    let index: number; // 当前魔数下标
    for (index = 0; index < magics.length; index++) {
      if (magics[index] > tempStep) {
        expectedStep = magics[index] * multiple; // 取出第一个大于tempStep的魔数，并乘以multiple作为期望得到的最佳间隔
        break;
      }
    }
    let axisMax: number = dataMax;
    let axisMin: number = dataMin;

    function countDegree(step: number): void {
      axisMax = parseInt('' + (dataMax / step + 1), 10) * step; // parseInt令小数去尾 -1.8 -> -1
      axisMin = parseInt('' + (dataMin / step - 1), 10) * step;
      if (dataMax === 0) {
        axisMax = 0;
      } // 优先0刻度
      if (dataMin === 0) {
        axisMin = 0;
      }
      if (symmetrical && axisMax * axisMin < 0) {
        const tm: number = Math.max(Math.abs(axisMax), Math.abs(axisMin));
        axisMax = tm;
        axisMin = -tm;
      }
    }

    countDegree(expectedStep);
    if (deviation) {
      return {
        max: this.fixedNum(axisMax),
        min: this.fixedNum(axisMin),
        interval: this.fixedNum(expectedStep),
        splitNumber: Math.round((axisMax - axisMin) / expectedStep),
      };
    } else if (!symmetrical || axisMax * axisMin > 0) {
      let tempSplitNumber: number;
      out: do {
        tempSplitNumber = Math.round((axisMax - axisMin) / expectedStep);
        if ((index - storedMagicsIndex) * (tempSplitNumber - splitNumber) < 0) { // 出现死循环
          while (tempSplitNumber < splitNumber) {
            if ((axisMin - dataMin <= axisMax - dataMax && axisMin !== 0) || axisMax === 0) {
              axisMin -= expectedStep;
            } else {
              axisMax += expectedStep;
            }
            tempSplitNumber++;
            if (tempSplitNumber === splitNumber) {
              break out;
            }
          }
        }
        if (index >= magics.length - 1 || index <= 0 || tempSplitNumber === splitNumber) {
          break;
        }
        storedMagicsIndex = index;
        if (tempSplitNumber > splitNumber) {
          expectedStep = magics[++index] * multiple;
        } else {
          expectedStep = magics[--index] * multiple;
        }
        countDegree(expectedStep);
      } while (tempSplitNumber !== splitNumber);
    }
    axisMax = this.fixedNum(axisMax);
    axisMin = this.fixedNum(axisMin);
    const interval: number = this.fixedNum((axisMax - axisMin) / splitNumber);
    return {
      max: axisMax,
      min: axisMin,
      interval,
      splitNumber,
    };
  }
}
