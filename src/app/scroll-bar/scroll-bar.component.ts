import {Component, OnDestroy, OnInit} from '@angular/core';
import * as barCharts from 'echarts';
import {ScrollBarService} from "./scroll-bar.service";

@Component({
  selector: 'app-scroll-bar',
  templateUrl: './scroll-bar.component.html',
  styleUrls: ['./scroll-bar.component.css']
})
export class ScrollBarComponent implements OnInit, OnDestroy {
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
}
