/**
 * Helper class to create an "Increasable object". This is an object that stores a register of the increasing (or decreasing) process
 * of a value, allowing to return the number of total oprations over it,  the steps and the total slope (difference between first and last value)
 */
export class Increasable {
  constructor(initialValue: number = 0) {
    this.accumulated = initialValue;
    this.slope;
    this.steps = [];
    this.totalCount = 0;
  }
  private accumulated: number;
  private slope: number | undefined;
  private totalCount: number;
  private steps: [number, number][];

  //getters

  /**
   * Returns current accumulated value
   * @returns {number}
   */
  get() {
    return this.accumulated;
  }
  getSlope() {
    return this.slope;
  }
  /**
   * Step is an array of tuples, eachone representing each operation made over the oncresable. The firs element
   * od the tuple is the increment for that step, the second is the current acccumulated of the increaseable on that step after appliying the value
   * @returns {[number, number][]}
   */
  getSteps() {
    return this.steps;
  }
  getCount() {
    return this.totalCount;
  }

  /**
   * Increase the accumulated by a value. If value is undefined, it increase by 1. If you whant to skip increase on undefined value, set
   * skipUndefined parameter to true
   * @param value {number}
   */
  increase(
    value?: number | undefined,
    skipUndefined?: { skipUndefined: boolean }
  ): void;
  increase(value?: number | undefined): void;
  increase(value?: number | undefined, param2?: { skipUndefined: boolean }) {
    if (
      typeof param2 === "object" &&
      param2["skipUndefined"] === true &&
      value === undefined
    )
      return;
    if (typeof value === "number" || value === undefined) {
      this.accumulated += value !== undefined ? value : 1;
      this.steps.push([value !== undefined ? value : 1, this.accumulated]);
      this.totalCount++;
      this.slope = this.calculateSlope();
    }
  }

  private calculateSlope() {
    if (this.steps.length > 1) {
      return this.steps[this.steps.length - 1][1] - this.steps[0][1];
    }
  }
}
