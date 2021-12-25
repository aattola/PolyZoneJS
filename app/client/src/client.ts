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

import * as Cfx from 'fivem-js';
import PolyZone from './PolyZone';

const zone = new PolyZone({
  points: [
    { x: -313.3014831543, y: -984.51873779297 },
    { x: -338.54843139648, y: -975.14208984375 },
    { x: -334.19384765625, y: -962.73211669922 },
    { x: -308.90802001953, y: -972.33142089844 },
  ],
  options: {
    name: 'Testinen',
    debugPoly: true,
    debugGrid: true,
    gridDivisions: 30,
  },
});

// setInterval(() => {
//   const pos = Cfx.Game.PlayerPed.Position;
//   console.log(zone.isPointInside(pos));
// }, 5000);

// zone.onPlayerInOut((isCurrInside, pedPos) => {
//   console.log(isCurrInside);
// }, 500);

// console.log(zone, 'Online');
