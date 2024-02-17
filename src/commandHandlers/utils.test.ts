import { getRandomPosition } from './utils';
import { Field } from '../database/GameDb';
import { makeField } from '../utils';
describe('getRandomPosition', () => {
  test('should fill all 100 cells in 100 tries', () => {
    const field: Field = makeField();
    for (let i = 0; i < 100; i++) {
      const { x, y } = getRandomPosition(field);
      field[x]![y]!.checked = true;
    }
    expect(field.flat().every((cell) => !!cell.checked)).toBeTruthy();
  });
});
