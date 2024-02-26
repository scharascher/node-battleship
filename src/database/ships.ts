import { Ship } from '../types';

const ships = [
  {
    position: {
      x: 0,
      y: 8,
    },
    direction: false,
    type: 'huge',
    length: 4,
  },
  {
    position: {
      x: 6,
      y: 7,
    },
    direction: false,
    type: 'large',
    length: 3,
  },
  {
    position: {
      x: 6,
      y: 3,
    },
    direction: false,
    type: 'large',
    length: 3,
  },
  {
    position: {
      x: 4,
      y: 1,
    },
    direction: true,
    type: 'medium',
    length: 2,
  },
  {
    position: {
      x: 2,
      y: 5,
    },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: {
      x: 1,
      y: 1,
    },
    direction: true,
    type: 'medium',
    length: 2,
  },
  {
    position: {
      x: 0,
      y: 5,
    },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: {
      x: 8,
      y: 0,
    },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: {
      x: 5,
      y: 5,
    },
    direction: false,
    type: 'small',
    length: 1,
  },
  {
    position: {
      x: 6,
      y: 0,
    },
    direction: false,
    type: 'small',
    length: 1,
  },
] as Ship[];
export const getRandomShips = (): Ship[] => {
  return ships;
};
