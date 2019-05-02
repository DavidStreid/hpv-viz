import { PatientOption } from './patient-option.class';

describe('PatientOption ', () => {
  it('Should have valid constructor and getters', () => {
    const name = 'test';
    const selected = false;
    const opt = new PatientOption(name, selected);
    expect(opt.getName()).toBe(name);
    expect(opt.isSelected()).toBe(selected);
  });

  it('On toggle, it should switch its selected state', () => {
    const selected = false;
    const opt = new PatientOption('', selected);
    expect(opt.isSelected()).toBe(selected);

    opt.toggle();
    expect(opt.isSelected()).toBe(true);

    opt.toggle();
    expect(opt.isSelected()).toBe(false);

    // Toggle w/ preset value
    opt.toggle(false);
    expect(opt.isSelected()).toBe(false);
  });
});
