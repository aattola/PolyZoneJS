import * as Cfx from 'fivem-js';
const eventPrefix = "_PolyZoneJS_:"

const defaultColorWalls = [0,255,0]
const defaultColorOutline = [255,0,0]
const defaultColorGrid = [255,255,255]

type Vector2 = { x:number, y:number }
type Vector3 = { x:number, y:number, z:number }
type Poly = any[]

function toVector2(x:number, y:number): Vector2 {
    return { x, y }
}

const abs = Math.abs
function isLeft(p0: Vector2, p1: Vector2, p2: Vector2) {
  const p0x = p0.x
  const p0y = p0.y
  return (p1.x - p0x) * (p2.y - p0y) - (p2.x - p0x) * (p1.y - p0y)
}

function wnInnerLoop(p0: Vector2, p1: Vector2, p2: Vector2, wn: number) {
  const p2y = p2.y

  if (p0.y <= p2y) {
    if (p1.y <= p2y) {
      if (isLeft(p0, p2, p1) > 0) {
        return wn + 1
      }
    }
  } else {
    if (p1.y <= p2y) {
      if (isLeft(p0, p2, p1) < 0) {
        return wn - 1
      }
    }
  }

  return wn
}

//TODO: WHY
function clearTbl(tbl: any[]) {
  if (tbl == null) return
  for (let i = 0; i < tbl.length; i++) {
    tbl[i] = null
  }
  return tbl
}

function copyTbl(tbl: any[]) {
  if (tbl == null) return
  const ret = []
  for (let i = 0; i < tbl.length; i++) {
    ret[i] = tbl[i]
  }
  return ret
}

function windingNumber(point: Vector2, poly: Poly) {
  let wn = 0
  for (let i = 0; i < poly.length; i++) {
    // todo: check if this is correct
    wn = wnInnerLoop(poly[i], poly[i], point, wn)
  }

  wn = wnInnerLoop(poly[poly.length-1], poly[0], point, wn)

  return wn != 0
}

function isIntersecting(a: Vector2, b: Vector2, c: Vector2, d: Vector2) {
  const ax_minus_cx = a.x - c.x
  const bx_minus_ax = b.x - a.x
  const dx_minus_cx = d.x - c.x
  const ay_minus_cy = a.y - c.y
  const by_minus_ay = b.y - a.y
  const dy_minus_cy = d.y - c.y

  const denominator = ((bx_minus_ax) * (dy_minus_cy)) - ((by_minus_ay) * (dx_minus_cx))
  const numerator1 = ((ay_minus_cy) * (dx_minus_cx)) - ((ax_minus_cx) * (dy_minus_cy))
  const numerator2 = ((ay_minus_cy) * (bx_minus_ax)) - ((ax_minus_cx) * (by_minus_ay))

  if (denominator == 0) {
    return numerator1 == 0 && numerator2 == 0
  }

  const r = numerator1 / denominator
  const s = numerator2 / denominator

  return (r >= 0 && r <= 1) && (s >= 0 && s <= 1)
}

function calculatePolygonArea(points: any[]) {
  function det2(i: number, j: number) {
    return points[i].x * points[j].y - points[j].x * points[i].y
  }

  let sum = points.length > 2 && det2(points.length, 1) || 0
  for (let i = 0; i < points.length; i++) {
    sum = sum + det2(i, i +1)
  }
  return abs(0.5 * sum)
}


function drawWall(p1: Vector2, p2: Vector2, minZ: number, maxZ: number, r: number, g: number, b: number, a: number) {
  const bottomLeft = new Cfx.Vector3(p1.x, p1.y, minZ)
  const topLeft = new Cfx.Vector3(p1.x, p1.y, maxZ)
  const bottomRight = new Cfx.Vector3(p2.x, p2.y, minZ)
  const topRight = new Cfx.Vector3(p2.x, p2.y, maxZ)
  const color = new Cfx.Color(r, g, b, a)

  Cfx.World.drawPoly(bottomLeft, topLeft, bottomRight, color)
  Cfx.World.drawPoly(topLeft, topRight, bottomRight, color)
  Cfx.World.drawPoly(bottomRight, topRight, topLeft, color)
  Cfx.World.drawPoly(bottomRight, topLeft, bottomLeft, color)
}

function drawGrid(poly: any) {
  let minZ = poly.minZ
  let maxZ = poly.maxZ
  if (!minZ || !maxZ) {
    const pedPos = Cfx.Game.PlayerPed.Position
    minZ = pedPos.z - 46.0
    maxZ = pedPos.z - 45.0
  }

  const lines = poly.lines

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const min = line.min
    const max = line.max

    const start = new Cfx.Vector3(min.x, min.y, maxZ)
    const end = new Cfx.Vector3(max.x, max.y, maxZ)
    const color = new Cfx.Color(defaultColorGrid[0], defaultColorGrid[1], defaultColorGrid[2], 196)

    Cfx.World.drawLine(start, end, color)
  }
}

function calculateGridCellPoints(cellX: number, cellY: number, poly: any) {
  const gridCellWidth = poly.gridCellWidth
  const gridCellHeight = poly.gridCellHeight
  const min = poly.min
  // min added to initial point, in order to shift the grid cells to the poly's starting position
  const x = cellX * gridCellWidth + min.x
  const y = cellY * gridCellHeight + min.y

  return [
    toVector2(x, y),
    toVector2(x + gridCellWidth, y),
    toVector2(x + gridCellWidth, y + gridCellHeight),
    toVector2(x, y + gridCellHeight),
    toVector2(x, y)
  ]
}

function isGridCellInsidePoly(cellX: number, cellY: number, poly: any) {
  let gridCellPoints = calculateGridCellPoints(cellX, cellY, poly)
  const polyPoints =
}

function pointInPoly(point: Vector3, poly: any) {
  const { x, y, z } = point
  const { x: minX, y: minY } = poly.min
  const max = poly.max

  if (x < minX || x > max.x || y < minY || y > max.y) {
    return false
  }

  const {minZ, maxZ} = poly

  if ((minZ && z < minZ) || (maxZ && z > maxZ)) {
    return false
  }

  const grid = poly.grid
  if (grid) {
    const gridDivisions = poly.gridDivisions
    const size = poly.size
    const gridPosX = x - minX
    const gridPosY = y - minY
    const gridCellX = (gridPosX * gridDivisions) // size.x
    const gridCellY = (gridPosY * gridDivisions) // size.y

    // todo: index from 0 or 1?
    let gridCellValue = grid[gridCellY + 1][gridCellX + 1]
    if (gridCellValue == null && poly.lazyGrid) {
      gridCellValue = isGridCellInsidePoly(gridCellX, gridCellY, poly)
      grid[gridCellY + 1][gridCellX + 1] = gridCellValue
    }

    if (gridCellValue) {
      return true
    }
  }

  return windingNumber(point, poly.points)
}
