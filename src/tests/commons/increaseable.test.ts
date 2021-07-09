import { expect } from "chai";
import { Increasable } from "../../commons/increaseable";

describe("Increaseable helper class", () => {
  it("instanciate propertly", () => {
    const increaseable = new Increasable();

    expect(increaseable).not.to.be.equal(undefined);
    expect(increaseable.get()).to.be.equal(0);
    expect(increaseable.getCount()).to.be.equal(0);
    expect(increaseable.getSteps().length).to.be.equal(0);
    expect(increaseable.getSlope()).to.be.equal(undefined);

    const increaseable_2 = new Increasable(1);
    expect(increaseable_2).not.to.be.equal(undefined);
    expect(increaseable_2.get()).to.be.equal(1);
    expect(increaseable_2.getCount()).to.be.equal(0);
    expect(increaseable_2.getSteps().length).to.be.equal(0);
    expect(increaseable_2.getSlope()).to.be.equal(undefined);
  });

  it("increase correctly with explicit value", () => {
    const increaseable = new Increasable();
    increaseable.increase(2);
    expect(increaseable.get()).to.be.equal(2);
  });

  it("increase correctly with non explicit value", () => {
    const increaseable = new Increasable();
    increaseable.increase();
    expect(increaseable.get()).to.be.equal(1);
  });
  it("doesnt increase when determined by parameter", () => {
    const increaseable = new Increasable();
    increaseable.increase(undefined, { skipUndefined: true });
    expect(increaseable.get()).to.be.equal(0) &&
      expect(increaseable.getCount()).to.be.equal(0);
    increaseable.increase(1, { skipUndefined: true });
    expect(increaseable.get()).to.be.equal(1) &&
      expect(increaseable.getCount()).to.be.equal(1);
    increaseable.increase(undefined, { skipUndefined: false });
    expect(increaseable.get()).to.be.equal(2) &&
      expect(increaseable.getCount()).to.be.equal(2);
  });
  it("calculates slope correctly", () => {
    const increaseable = new Increasable();
    increaseable.increase(1);
    increaseable.increase(1);
    increaseable.increase(1);
    
    expect(increaseable.getSlope()).to.be.equal(2);
  });
});
