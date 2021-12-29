// PolyZone:Create({
//   vector2(-313.3014831543, -984.51873779297),
//   vector2(-338.54843139648, -975.14208984375),
//   vector2(-334.19384765625, -962.73211669922),
//   vector2(-308.90802001953, -972.33142089844)
// }, {
//   name="gettista",
//     --minZ = 31.080598831177,
//     --maxZ = 31.080629348755
// })

// import * as Cfx from 'fivem-js';
// import BoxZone from './BoxZone';
// import PolyZone from './PolyZone';

// const Poly = require('./PolyZone');
import Poly from './PolyZone';
import PolyZone from './PolyZone';
import BoxZone from './BoxZone';
// //
// const zone = new PolyZone({
//   points: [
//     { x: -313.3014831543, y: -984.51873779297 },
//     { x: -338.54843139648, y: -975.14208984375 },
//     { x: -334.19384765625, y: -962.73211669922 },
//     { x: -308.90802001953, y: -972.33142089844 },
//   ],
//   options: {
//     name: 'Testinen',
//     debugPoly: true,
//     debugGrid: true,
//     gridDivisions: 30,
//
//   },
// });

// BoxZone:Create(vector3(-255.5, -993.52, 31.08), 20, 30, {
//   name="laatikko",
//   heading=0,
// --debugPoly=true
// })

// BoxZone:Create(vector3(-293.41, -981.58, 31.08), 3, 1, {
//   name="kissatesti",
//   heading=0,
// --debugPoly=true
// })
//
//
// const box = new BoxZone({
//   box: {
//     x: -293.41, y: -981.58, z: 31.08, l: 3, w: 1,
//   },
//   options: {
//     name: 'test',
//     heading: 0,
//     debugPoly: true,
//     minZ: 150,
//     maxZ: 300,
//   },
// }).create();
//
// console.log(box, 'boxi');

// setInterval(() => {
//   const pos = Cfx.Game.PlayerPed.Position;
//   console.log(zone.isPointInside(pos));
// }, 5000);

// zone.onPlayerInOut((isCurrInside, pedPos) => {
//   console.log(isCurrInside);
// }, 500);

// @ts-ignore
// eslint-disable-next-line dot-notation
const createExport = global['exports'];

createExport('createPoly', (options: any) => {
  const zone = new PolyZone(options).create();

  return {
    zoneId: 123, // todo: id
  };
});

// @ts-ignore
// eslint-disable-next-line dot-notation
global['PolyJS'] = { PolyZone, BoxZone };
