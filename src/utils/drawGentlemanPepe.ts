/**
 * drawGentlemanPepe.ts
 *
 * High-fidelity, smooth pixel-art renderer with control-synced procedural kinematics:
 * - Phase-accumulated animation cycle locked directly to movement velocity
 * - Dynamic forward lean during acceleration and sharp backward tilt during jumps
 * - Fully articulated limbs with inverse-kinematic stride sync
 */

export interface GentlemanPepeOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  runFrame: number;      // Continuous phase accumulator (e.g., += velocity * dt)
  velocity?: number;     // Current movement speed for stride frequency scaling
  isSliding?: boolean;
  isJumping?: boolean;
  isMoving?: boolean;
  direction?: number;    // 1 = right, -1 = left
  suitColor?: string;
  boostActive?: boolean;
  shieldActive?: boolean;
  mode?: "run" | "catch" | "idle";
}

export function drawGentlemanPepe({
  ctx,
  x,
  y,
  width,
  height,
  runFrame,
  velocity = 5,
  isSliding = false,
  isJumping = false,
  isMoving = true,
  direction = 1,
  suitColor = "#0f1524",
  boostActive = false,
  shieldActive = false,
  mode = "run",
}: GentlemanPepeOptions): void {
  ctx.save();

  // Direction flipping
  if (direction === -1) {
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.translate(-x, -y);
  }

  const cx = x + width / 2;
  const groundY = y + height;

  // -------------------------------------------------------------------------
  // 1. SLIDING KINEMATICS (Aerodynamic low-profile layout)
  // -------------------------------------------------------------------------
  if (isSliding) {
    // Ground friction sparks & velocity streak lines
    ctx.fillStyle = "#facc15";
    ctx.fillRect(x + 2, groundY - 2, 10, 2);
    ctx.fillRect(x + 18, groundY - 3, 16, 2);
    ctx.fillRect(x + 38, groundY - 2, 9, 2);

    // Stretched Sliding Leg & Pointed Shoe
    ctx.fillStyle = "#64748b";
    ctx.fillRect(x + 2, y + 19, 24, 11);
    
    ctx.fillStyle = "#0c101b";
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 20);
    ctx.lineTo(x - 16, y + 24); // Sharp aerodynamic toe
    ctx.lineTo(x - 6, y + 29);
    ctx.closePath();
    ctx.fill();

    // Streamlined Suit Body
    ctx.fillStyle = suitColor;
    ctx.fillRect(x + 16, y + 11, 32, 19);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 16, y + 11, 32, 19);

    // Tie streaming straight back horizontally from speed
    ctx.fillStyle = boostActive ? "#facc15" : "#2563eb";
    ctx.fillRect(x + 2, y + 14, 20, 4);

    // Pepe Head tucked low
    ctx.fillStyle = "#5ba138";
    ctx.beginPath();
    ctx.ellipse(x + 44, y + 15, 17, 13, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Sunglasses (Sleek black shades matching reference)
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 38, y + 8, 16, 8);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 38, y + 8, 16, 8);

    ctx.restore();
    return;
  }

  // -------------------------------------------------------------------------
  // 2. SMOOTH CONTROL-SYNCED PROCEDURAL DYNAMICS (Run / Jump / Catch)
  // -------------------------------------------------------------------------
  // Sync stride frequency and amplitude directly to actual movement velocity
  const speedFactor = Math.min(Math.max(Math.abs(velocity) / 6, 0.4), 1.8);
  const effectiveFrame = isMoving ? runFrame * speedFactor : 0;

  // Smooth vertical body bounce synchronized with leg cycle peaks
  const bob = isJumping ? -4 : Math.abs(Math.sin(effectiveFrame)) * 4.2;
  const leanAngle = isJumping ? -0.2 : (isMoving ? 0.15 : 0); // Leans forward into runs

  ctx.save();
  ctx.translate(cx, y + height);
  ctx.rotate(leanAngle);
  ctx.translate(-cx, -(y + height));

  const torsoY = y + 22 + bob;
  const headY = y + bob;

  // --- DYNAMIC FLAPPING TAILCOAT (Velocity reactive) ---
  const tailFlap = isMoving ? Math.sin(effectiveFrame * 1.5) * 10 : 0;
  ctx.fillStyle = "#0c101b";
  ctx.beginPath();
  ctx.moveTo(cx - 12, torsoY + 18);
  ctx.lineTo(cx + 6, torsoY + 18);
  ctx.lineTo(cx - 8 - tailFlap, torsoY + 40);
  ctx.lineTo(cx - 18 - tailFlap, torsoY + 34);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // --- SYNCHRONIZED LEG KINEMATICS ---
  const legCycle = isJumping ? 0 : Math.sin(effectiveFrame);
  const stepDist = isJumping ? 0 : legCycle * 14;

  // Back Leg
  const backFootX = cx - 8 - stepDist;
  const backFootY = groundY - 6 + (legCycle > 0 ? legCycle * 6 : 0);
  
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 6, torsoY + 18);
  ctx.lineTo(backFootX, backFootY);
  ctx.stroke();

  // Back Shoe with curved toe
  ctx.fillStyle = "#0c101b";
  ctx.fillRect(backFootX - 6, backFootY - 3, 14, 6);
  ctx.beginPath();
  ctx.moveTo(backFootX + 8, backFootY - 3);
  ctx.lineTo(backFootX + 16, backFootY - 1);
  ctx.lineTo(backFootX + 14, backFootY + 3);
  ctx.lineTo(backFootX + 8, backFootY + 3);
  ctx.closePath();
  ctx.fill();

  // Front Leg
  const frontFootX = cx + 6 + stepDist;
  const frontFootY = groundY - 6 + (legCycle < 0 ? Math.abs(legCycle) * 6 : 0);

  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 7.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + 6, torsoY + 18);
  ctx.lineTo(frontFootX, frontFootY);
  ctx.stroke();

  // Front Shoe with curved toe
  ctx.fillStyle = "#0c101b";
  ctx.fillRect(frontFootX - 6, frontFootY - 3, 15, 6);
  ctx.beginPath();
  ctx.moveTo(frontFootX + 9, frontFootY - 3);
  ctx.lineTo(frontFootX + 18, frontFootY - 1);
  ctx.lineTo(frontFootX + 16, frontFootY + 3);
  ctx.lineTo(frontFootX + 9, frontFootY + 3);
  ctx.closePath();
  ctx.fill();

  // --- TAILORED SUIT TORSO ---
  ctx.fillStyle = suitColor;
  ctx.fillRect(cx - 16, torsoY, 32, 24);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - 16, torsoY, 32, 24);

  // White Shirt & Necktie (Reacts to movement momentum)
  const tieSway = isMoving ? Math.sin(effectiveFrame) * 5 : 0;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cx - 5, torsoY, 10, 14);
  
  ctx.fillStyle = boostActive ? "#facc15" : "#2563eb";
  ctx.beginPath();
  ctx.moveTo(cx - 3, torsoY + 4);
  ctx.lineTo(cx + 3, torsoY + 4);
  ctx.lineTo(cx + 4 - tieSway, torsoY + 20);
  ctx.lineTo(cx - tieSway, torsoY + 22);
  ctx.lineTo(cx - 4 - tieSway, torsoY + 20);
  ctx.closePath();
  ctx.fill();

  // Gold Waistcoat Buttons
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(cx, torsoY + 12, 2, 0, Math.PI * 2);
  ctx.arc(cx, torsoY + 18, 2, 0, Math.PI * 2);
  ctx.fill();

  // --- SYNCHRONIZED ARM KINEMATICS (Pumping opposite to legs) ---
  const armCycle = isJumping ? 0 : Math.sin(effectiveFrame + Math.PI);
  
  // Front Arm & Hand (Swinging forward with articulated frog fingers)
  const frontHandX = cx + 16 + (isMoving ? armCycle * 8 : 0);
  const frontHandY = torsoY + 8 + (isMoving ? Math.cos(effectiveFrame) * 4 : 0);

  ctx.strokeStyle = suitColor;
  ctx.lineWidth = 6.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + 12, torsoY + 5);
  ctx.lineTo(frontHandX, frontHandY);
  ctx.stroke();

  // Green Frog Hand (Clenched running fist matching image reference)
  ctx.fillStyle = "#5ba138";
  ctx.beginPath();
  ctx.arc(frontHandX + 2, frontHandY + 2, 5, 0, Math.PI * 2);
  ctx.fill();

  // --- PEPE HEAD & ICONIC SHADES (Matched to reference asset) ---
  const headCx = cx;
  const headCy = headY + 12;

  ctx.fillStyle = "#5ba138";
  ctx.beginPath();
  ctx.ellipse(headCx, headCy, 20, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#122b10";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Smug Red/Brown Lips
  ctx.strokeStyle = "#7c3a22";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(headCx - 6, headCy + 7);
  ctx.lineTo(headCx + 12, headCy + 6);
  ctx.lineTo(headCx + 15, headCy + 4);
  ctx.stroke();

  // Iconic Black Sunglasses / Shades (Clean dark curved executive specs)
  ctx.fillStyle = "#0a0e17";
  ctx.beginPath();
  ctx.roundRect(headCx - 16, headCy - 8, 30, 11, 3);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Sunglasses light reflection sheen
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillRect(headCx - 12, headCy - 6, 8, 3);
  ctx.fillRect(headCx + 2, headCy - 6, 8, 3);

  ctx.restore();
}