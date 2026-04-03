import { test, expect } from '@playwright/test';

async function openBlankDiagram(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-action="open-create-modal"]').first()).toBeVisible();
  await page.locator('[data-action="open-create-modal"]').first().click();
  await page.locator('[data-action="set-create-mode"][data-mode="blank"]').click();
  await page.locator('[data-action="confirm-create"]').click();
  await expect(page.getByTestId('diagram-stage')).toBeVisible();
  await dismissGuide(page);
  await page.waitForTimeout(100);
}

async function dismissGuide(page) {
  const skip = page.locator('[data-action="skip-guide"]');
  if (await skip.count()) {
    if (await skip.first().isVisible()) await skip.first().click();
  }
}

async function getNodeIdByLabel(page, label) {
  const node = page.locator(`[data-testid="diagram-node"][data-node-label="${label}"]`).first();
  await expect(node).toBeVisible();
  const id = await node.getAttribute('data-node-id');
  if (!id) throw new Error(`Node id missing for label ${label}`);
  return id;
}

async function getLastNodeId(page) {
  const node = page.locator('[data-testid="diagram-node"]').last();
  await expect(node).toBeVisible();
  const id = await node.getAttribute('data-node-id');
  if (!id) throw new Error('Last node id missing');
  return id;
}

function nodeLocator(page, nodeId) {
  return page.locator(`[data-node-id="${nodeId}"]`).first();
}

function nodeShapeLocator(page, nodeId) {
  return nodeLocator(page, nodeId).locator('rect, path, ellipse').first();
}

async function clickNode(page, nodeId) {
  const shape = nodeShapeLocator(page, nodeId);
  await expect(shape).toBeVisible();
  await shape.click({ force: true });
}

async function addSiblingNodeId(page) {
  await page.locator('[data-action="add-sibling"]').first().click();
  await page.waitForTimeout(40);
  return getLastNodeId(page);
}

async function createManualEdge(page, sourceId, targetId) {
  const before = await page.locator('[data-testid="diagram-edge"]').count();
  await clickNode(page, sourceId);
  await page.getByTestId('toolbar-connect').click();
  await clickNode(page, targetId);
  await expect(page.locator('[data-testid="diagram-edge"]')).toHaveCount(before + 1);
  const edge = page.locator('[data-testid="diagram-edge"]').last();
  const edgeId = await edge.getAttribute('data-edge-id');
  if (!edgeId) throw new Error('New edge id missing');
  return { edge, edgeId };
}

async function selectEdge(page, edgeId) {
  const edge = page.locator(`[data-edge-id="${edgeId}"]`);
  await expect(edge).toBeVisible();
  const point = await getEdgeScreenMidpoint(page, edgeId);
  if (!point) throw new Error(`Unable to derive midpoint for edge ${edgeId}`);
  await page.mouse.click(point.x, point.y);
  await expect(edge.locator('[data-edge-handle="target"]')).toBeVisible();
}

async function centerOf(locator) {
  for (let attempt = 0; attempt < 18; attempt += 1) {
    const box = await locator.boundingBox();
    if (box && box.width > 0 && box.height > 0) {
      return {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
      };
    }
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('Unable to read bounding box for locator');
}

async function getEdgeScreenMidpoint(page, edgeId) {
  return page.evaluate((id) => {
    const hit = document.querySelector(`[data-edge-id="${id}"] .diagram-edge-hit`);
    if (!(hit instanceof SVGGeometryElement)) return null;
    const svg = hit.ownerSVGElement;
    const matrix = hit.getScreenCTM();
    if (!svg || !matrix) return null;
    const length = hit.getTotalLength();
    const mid = hit.getPointAtLength(length * 0.5);
    const point = svg.createSVGPoint();
    point.x = mid.x;
    point.y = mid.y;
    const screen = point.matrixTransform(matrix);
    return { x: screen.x, y: screen.y };
  }, edgeId);
}

async function dragWithFrames(page, from, to, options = {}) {
  const steps = options.steps ?? 22;
  const pauseMs = options.pauseMs ?? 6;
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let index = 1; index <= steps; index += 1) {
    const ratio = index / steps;
    await page.mouse.move(
      from.x + (to.x - from.x) * ratio,
      from.y + (to.y - from.y) * ratio,
    );
    if (pauseMs > 0) await page.waitForTimeout(pauseMs);
  }
  await page.mouse.up();
}

function moduloDistance(value, grid = 8) {
  const modulo = ((value % grid) + grid) % grid;
  return Math.min(modulo, Math.abs(grid - modulo));
}

test.describe('Lucidity interactions', () => {
  test.beforeEach(async ({ page }) => {
    await openBlankDiagram(page);
  });

  test('[@canvas @drag @snap] node drag snaps to grid unless Shift is held', async ({ page }) => {
    const rootId = await getNodeIdByLabel(page, 'Central Topic');
    const root = nodeLocator(page, rootId);
    const rootShape = nodeShapeLocator(page, rootId);
    await clickNode(page, rootId);

    const dragStart = await centerOf(rootShape);
    await dragWithFrames(page, dragStart, { x: dragStart.x + 73, y: dragStart.y + 51 }, { steps: 20, pauseMs: 4 });

    const snappedX = Number(await root.getAttribute('data-node-x'));
    const snappedY = Number(await root.getAttribute('data-node-y'));
    expect(moduloDistance(snappedX, 8)).toBeLessThan(0.01);
    expect(moduloDistance(snappedY, 8)).toBeLessThan(0.01);

    const shiftStart = await centerOf(rootShape);
    await page.keyboard.down('Shift');
    await dragWithFrames(page, shiftStart, { x: shiftStart.x + 29, y: shiftStart.y + 17 }, { steps: 18, pauseMs: 4 });
    await page.keyboard.up('Shift');

    const shiftedX = Number(await root.getAttribute('data-node-x'));
    const shiftedY = Number(await root.getAttribute('data-node-y'));
    const xOffGrid = moduloDistance(shiftedX, 8) > 0.4;
    const yOffGrid = moduloDistance(shiftedY, 8) > 0.4;
    expect(xOffGrid || yOffGrid).toBeTruthy();
  });

  test('[@connectors @create] connect mode creates manual elbow connectors', async ({ page }) => {
    const sourceId = await getNodeIdByLabel(page, 'Central Topic');
    const targetId = await addSiblingNodeId(page);

    const { edge } = await createManualEdge(page, sourceId, targetId);
    await expect(edge).toHaveAttribute('data-edge-style', 'elbow');
    await expect(edge).toHaveAttribute('data-edge-kind', 'manual');
  });

  test('[@connectors @reconnect @relationships] endpoint drag reconnects an edge target', async ({ page }) => {
    const sourceId = await getNodeIdByLabel(page, 'Central Topic');
    const firstTargetId = await addSiblingNodeId(page);
    await page.locator('[data-action="insert-shape"][data-shape="rect"]').first().click();
    const nextTargetId = await getLastNodeId(page);

    const { edgeId } = await createManualEdge(page, sourceId, firstTargetId);
    await page.locator('[data-action="center-document"]').click();
    await page.waitForTimeout(80);
    await selectEdge(page, edgeId);

    const endpointHandle = page.locator(`[data-edge-id="${edgeId}"] [data-edge-handle="target"]`);
    const handleCenter = await centerOf(endpointHandle);
    const targetCenter = await centerOf(nodeShapeLocator(page, nextTargetId));
    await dragWithFrames(page, handleCenter, targetCenter, { steps: 24, pauseMs: 5 });

    await expect(page.locator(`[data-edge-id="${edgeId}"]`)).toHaveAttribute('data-edge-target', nextTargetId);
  });

  test('[@editing @inline] inline editing updates node and edge labels', async ({ page }) => {
    const sourceId = await getNodeIdByLabel(page, 'Central Topic');
    const source = nodeShapeLocator(page, sourceId);

    await source.dblclick({ force: true });
    const inlineInput = page.getByTestId('inline-editor-input');
    await expect(inlineInput).toBeVisible();
    await inlineInput.fill('Core Topic');
    await inlineInput.press('Enter');

    const coreId = await getNodeIdByLabel(page, 'Core Topic');
    const targetId = await addSiblingNodeId(page);
    const { edgeId } = await createManualEdge(page, coreId, targetId);

    const midpoint = await getEdgeScreenMidpoint(page, edgeId);
    if (!midpoint) throw new Error(`Unable to derive midpoint for edge ${edgeId}`);
    await page.mouse.dblclick(midpoint.x, midpoint.y);
    await expect(inlineInput).toBeVisible();
    await inlineInput.fill('Depends on');
    await inlineInput.press('Enter');

    await expect(page.locator(`[data-edge-id="${edgeId}"] text`).filter({ hasText: 'Depends on' })).toBeVisible();
  });

  test('[@connectors @precision] segment handles add bend points and bend handles reshape path', async ({ page }) => {
    const sourceId = await getNodeIdByLabel(page, 'Central Topic');
    const targetId = await addSiblingNodeId(page);
    const { edgeId } = await createManualEdge(page, sourceId, targetId);

    await selectEdge(page, edgeId);
    const styleSelect = page.locator('select[data-field="edge-style"]').first();
    await expect(styleSelect).toBeVisible();
    await styleSelect.selectOption('elbow');
    await expect(page.locator(`[data-edge-id="${edgeId}"]`)).toHaveAttribute('data-edge-style', 'elbow');

    const edgePath = page.locator(`[data-edge-id="${edgeId}"] .diagram-edge-stroke`);
    const beforePath = await edgePath.getAttribute('d');

    const segmentHandle = page.locator(`[data-edge-id="${edgeId}"] [data-testid="edge-segment-handle"]`).first();
    await expect(segmentHandle).toBeVisible();
    const segmentCenter = await centerOf(segmentHandle);
    await dragWithFrames(page, segmentCenter, { x: segmentCenter.x + 64, y: segmentCenter.y - 44 }, { steps: 22, pauseMs: 5 });

    const bendCount = Number(await page.locator(`[data-edge-id="${edgeId}"]`).getAttribute('data-edge-bend-count'));
    expect(bendCount).toBeGreaterThan(0);

    const bendHandle = page.locator(`[data-edge-id="${edgeId}"] [data-testid="edge-bend-handle"]`).first();
    await expect(bendHandle).toBeVisible();
    const bendCenter = await centerOf(bendHandle);
    await dragWithFrames(page, bendCenter, { x: bendCenter.x - 48, y: bendCenter.y + 36 }, { steps: 20, pauseMs: 5 });

    const afterPath = await edgePath.getAttribute('d');
    expect(afterPath).toBeTruthy();
    expect(afterPath).not.toEqual(beforePath);
  });
});
