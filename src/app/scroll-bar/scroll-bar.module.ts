export interface ScaleOption {
  /**
   * 数据最大值
   *
   * @type {(number | null)}
   * @memberof ScaleOption
   */
  max: number | null;
  /**
   * 数据最小值
   *
   * @type {(number | null)}
   * @memberof ScaleOption
   */
  min: number | null;
  /**
   * 预期分成几个区间
   *
   * @type {number}
   * @memberof ScaleOption
   */
  splitNumber?: number;
  /**
   * 存在异号数据时正负区间是否需要对称
   *
   * @type {boolean}
   * @memberof ScaleOption
   */
  symmetrical?: boolean;
  /**
   * 是否允许实际分成的区间数有误差
   *
   * @type {boolean}
   * @memberof ScaleOption
   */
  deviation?: boolean;
  /**
   * 是否优先取到0刻度
   *
   * @type {boolean}
   * @memberof ScaleOption
   */
  preferZero?: boolean;
}

export interface ScaleResult {
  max?: number;
  min?: number;
  interval?: number;
  splitNumber?: number;
}
