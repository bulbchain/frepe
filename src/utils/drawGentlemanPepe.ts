/**
 * drawGentlemanPepe.ts
 *
 * High-fidelity, retro pixel-art renderer for the Executive Gentleman Pepe mascot:
 * Directly crafted to mirror the iconic meme reference:
 * - Wide classic Pepe frog head with green emerald cheek gem and smug expression
 * - Iconic white rectangular horn-rimmed glasses with bridge and eyelids
 * - Gentleman's Black Silk Top Hat with hatband, buckle, and curved brim
 * - Crown of crispy golden french fries on his head with toasted crispy tips
 * - Tailored black tuxedo tailcoat with peaked lapels, white collared shirt, and royal blue tie
 * - Double gold buttons on waistcoat and gold sleeve cufflinks
 * - Fully animated green frog hands with 4 articulated digits/fingers swinging in stride
 * - Grey tailored dress trousers with sharp crease lines and knee articulation
 * - Black formal dress shoes with distinct curved pointed toe caps ("with a toe")
 * - Dynamic split coat tails flapping in the wind
 * - Dedicated kinematics for running, sliding, jumping, and fry catching
 */

export interface GentlemanPepeOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  runFrame: number;
  isSliding?: boolean;
  isJumping?: boolean;
  isMoving?: boolean;
  direction?: number; // 1 = right, -1 = left
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

  // Direction flipping if facing left
  if (direction === -1) {
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.translate(-x, -y);
  }

  const cx = x + width / 2;
  const groundY = y + height;

  // -------------------------------------------------------------------------
  // 1. SLIDING KINEMATICS (Pepe ducking low flat against the asphalt)
  // -------------------------------------------------------------------------
  if (isSliding) {
    // Sliding Sparks under body
    ctx.fillStyle = "#facc15";
    ctx.fillRect(x + 4, groundY - 2, 8, 2);
    ctx.fillRect(x + 20, groundY - 3, 14, 2);
    ctx.fillRect(x + 38, groundY - 2, 7, 2);

    // Stretched Grey Trousers (Back Leg)
    ctx.fillStyle = "#64748b";
    ctx.fillRect(x + 4, y + 18, 22, 12);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 4, y + 18, 22, 12);

    // Black formal dress shoe with distinct curved pointed toe ("with a toe")
    ctx.fillStyle = "#0c101b";
    ctx.fillRect(x - 6, y + 20, 12, 8);
    // Pointed toe cap
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 20);
    ctx.lineTo(x - 14, y + 23); // Toe tip
    ctx.lineTo(x - 6, y + 28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#475569";
    ctx.fillRect(x - 5, y + 21, 6, 2); // Glossy toe shine

    // Black Tuxedo Tailcoat stretched low
    ctx.fillStyle = suitColor;
    ctx.fillRect(x + 18, y + 10, 30, 20);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 18, y + 10, 30, 20);

    // White Shirt collar & Royal Blue tie streaming back
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 26, y + 12, 10, 6);
    ctx.fillStyle = boostActive ? "#facc15" : "#2563eb";
    ctx.fillRect(x + 4, y + 13, 22, 4); // Streaming tie

    // Gold Buttons
    ctx.fillStyle = "#facc15";
    ctx.fillRect(x + 34, y + 16, 3, 3);
    ctx.fillRect(x + 34, y + 22, 3, 3);

    // Pepe Frog Head tilted forward
    ctx.fillStyle = "#5ba138";
    ctx.beginPath();
    ctx.ellipse(x + 45, y + 16, 17, 13, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#122b10";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Emerald Cheek Brooch
    ctx.fillStyle = "#0e3816";
    ctx.beginPath();
    ctx.arc(x + 37, y + 17, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(x + 37, y + 17, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 36, y + 16, 1.5, 1.5);

    // White Spectacles (Glasses Frame & Eye)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x + 44, y + 8, 12, 10);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 46, y + 10, 8, 6);
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 50, y + 11, 4, 4); // Pupil looking forward

    // Glasses Bridge
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 41, y + 12, 4, 2.5);

    // Smug Mouth
    ctx.strokeStyle = "#7c3a22";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 42, y + 22);
    ctx.lineTo(x + 56, y + 21);
    ctx.stroke();

    // Top Hat tilted back
    ctx.fillStyle = "#111624";
    ctx.fillRect(x + 31, y - 4, 18, 14);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.8;
    ctx.strokeRect(x + 31, y - 4, 18, 14);
    // Brim
    ctx.fillStyle = "#0a0e17";
    ctx.fillRect(x + 24, y + 7, 28, 4.5);

    // Crispy French Fries on head streaming behind hat
    ctx.fillStyle = "#fbbf24";
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 1;
    ctx.fillRect(x + 14, y - 8, 17, 4.5);
    ctx.strokeRect(x + 14, y - 8, 17, 4.5);
    ctx.fillRect(x + 18, y - 13, 15, 4.5);
    ctx.strokeRect(x + 18, y - 13, 15, 4.5);

    // Hand gripping Top Hat Brim (Pepe frog hand with visible articulated fingers!)
    ctx.fillStyle = "#5ba138";
    ctx.beginPath();
    ctx.arc(x + 33, y + 6, 4, 0, Math.PI * 2);
    ctx.fill();
    // 3 fingers clasping the brim
    ctx.fillStyle = "#5ba138";
    ctx.fillRect(x + 30, y + 4, 5, 2);
    ctx.fillRect(x + 31, y + 7, 6, 2);
    ctx.fillRect(x + 32, y + 10, 5, 2);

    // Front arm reaching forward with fingers skimming the road
    ctx.fillStyle = "#5ba138";
    ctx.beginPath();
    ctx.arc(x + 56, y + 26, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + 57, y + 24, 6, 2);
    ctx.fillRect(x + 58, y + 27, 7, 2);
    ctx.fillRect(x + 56, y + 29, 5, 2);

    ctx.restore();
    return;
  }

  // -------------------------------------------------------------------------
  // 2. UPRIGHT KINEMATICS (Running, Jumping, and Fry Catching)
  // -------------------------------------------------------------------------
  const bob = isJumping ? 0 : Math.abs(Math.cos(runFrame)) * 3.5;
  const legCycle = isJumping ? 0 : Math.sin(runFrame);
  const armCycle = isJumping ? 0 : Math.sin(runFrame + Math.PI); // Arms pump opposite to legs!

  const headY = y + 1 + bob;
  const torsoY = y + 24 + bob;

  // --- DYNAMIC FLAPPING TAILCOAT (Split tails behind Pepe) ---
  const tailFlap = Math.sin(runFrame * 1.7) * 8;
  ctx.fillStyle = "#0c101b";
  ctx.beginPath();
  ctx.moveTo(cx - 14, torsoY + 20);
  ctx.lineTo(cx + 4, torsoY + 20);
  ctx.lineTo(cx - 10 - tailFlap, torsoY + 42);
  ctx.lineTo(cx - 18 - tailFlap, torsoY + 37);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // --- BACK ARM (LEFT ARM & ARTICULATED GREEN FROG HAND) ---
  const backArmAngle = isJumping ? -0.45 : armCycle * 0.75;
  const backShoulderX = cx - 12;
  const backShoulderY = torsoY + 6;
  const backHandX = backShoulderX - Math.sin(backArmAngle) * 18;
  const backHandY = backShoulderY + Math.cos(backArmAngle) * 16;

  // Back Sleeve (dark jacket)
  ctx.strokeStyle = suitColor;
  ctx.lineWidth = 6.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(backShoulderX, backShoulderY);
  ctx.lineTo(backHandX, backHandY);
  ctx.stroke();

  // White Shirt Cuff
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(backHandX, backHandY, 3.8, 0, Math.PI * 2);
  ctx.fill();

  // Gold Cufflink
  ctx.fillStyle = "#facc15";
  ctx.fillRect(backHandX - 1, backHandY - 1, 2, 2);

  // Back Green Frog Hand with 4 Articulated Digits/Fingers
  ctx.fillStyle = "#5ba138";
  ctx.beginPath();
  ctx.arc(backHandX, backHandY + 2, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#5ba138";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(backHandX, backHandY + 1);
  ctx.lineTo(backHandX - 6, backHandY);
  ctx.moveTo(backHandX, backHandY + 2);
  ctx.lineTo(backHandX - 7, backHandY + 3);
  ctx.moveTo(backHandX, backHandY + 3);
  ctx.lineTo(backHandX - 5, backHandY + 6);
  ctx.moveTo(backHandX, backHandY + 4);
  ctx.lineTo(backHandX - 3, backHandY + 8);
  ctx.stroke();

  // --- LEGS, GREY TROUSERS, AND BLACK SHOES WITH DEFINED TOES ---
  const legSwingDist = isJumping ? 0 : legCycle * 17;

  // 1. BACK LEG (Left Leg)
  const leftHipX = cx - 8;
  const leftHipY = torsoY + 20;
  let leftFootX: number;
  let leftFootY: number;

  if (isJumping) {
    leftFootX = cx - 14;
    leftFootY = torsoY + 38;
  } else {
    leftFootX = leftHipX - legSwingDist;
    leftFootY = groundY - 7 + (legSwingDist > 0 ? Math.sin(runFrame) * 8 : 0);
  }

  // Grey Trouser Leg
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 6.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(leftHipX, leftHipY);
  ctx.lineTo(leftFootX, leftFootY);
  ctx.stroke();
  // Trouser Crease line
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(leftHipX, leftHipY + 2);
  ctx.lineTo(leftFootX, leftFootY - 1);
  ctx.stroke();

  // Left Black Dress Shoe with Distinct Curved Pointed Toe ("with a toe")
  ctx.save();
  ctx.translate(leftFootX, leftFootY);
  const leftToeTilt = isJumping ? 0.35 : (legSwingDist / 17) * 0.45;
  ctx.rotate(leftToeTilt);
  // Shoe Heel & Body
  ctx.fillStyle = "#0c101b";
  ctx.fillRect(-6, -3, 14, 6);
  // Pronounced curved pointed toe cap
  ctx.beginPath();
  ctx.moveTo(6, -3);
  ctx.lineTo(15, -1); // Curved tip pointing forward/up
  ctx.lineTo(14, 3);
  ctx.lineTo(6, 3);
  ctx.closePath();
  ctx.fill();
  // Toe shine highlight & stitching
  ctx.fillStyle = "#475569";
  ctx.fillRect(4, -2, 7, 2);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-6, -3, 20, 6);
  ctx.restore();

  // 2. FRONT LEG (Right Leg)
  const rightHipX = cx + 6;
  const rightHipY = torsoY + 20;
  let rightFootX: number;
  let rightFootY: number;

  if (isJumping) {
    rightFootX = cx + 16;
    rightFootY = torsoY + 36;
  } else {
    rightFootX = rightHipX + legSwingDist;
    rightFootY = groundY - 7 + (legSwingDist < 0 ? Math.abs(Math.sin(runFrame)) * 8 : 0);
  }

  // Grey Trouser Leg
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(rightHipX, rightHipY);
  ctx.lineTo(rightFootX, rightFootY);
  ctx.stroke();
  // Front crease line
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(rightHipX, rightHipY + 2);
  ctx.lineTo(rightFootX, rightFootY - 1);
  ctx.stroke();

  // Right Black Dress Shoe with Distinct Curved Pointed Toe ("with a toe")
  ctx.save();
  ctx.translate(rightFootX, rightFootY);
  const rightToeTilt = isJumping ? -0.25 : (-legSwingDist / 17) * 0.45;
  ctx.rotate(rightToeTilt);
  // Shoe Heel & Body
  ctx.fillStyle = "#0c101b";
  ctx.fillRect(-6, -3, 15, 6);
  // Pronounced curved pointed toe cap
  ctx.beginPath();
  ctx.moveTo(7, -3);
  ctx.lineTo(17, -1); // Upward curved toe point!
  ctx.lineTo(16, 3);
  ctx.lineTo(7, 3);
  ctx.closePath();
  ctx.fill();
  // Shoe Toe Cap Highlight & Stitching
  ctx.fillStyle = "#64748b";
  ctx.fillRect(5, -2, 8, 2);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-6, -3, 22, 6);
  ctx.restore();

  // --- TAILORED TUXEDO BODY ---
  ctx.fillStyle = suitColor;
  ctx.fillRect(cx - 17, torsoY, 34, 25);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - 17, torsoY, 34, 25);

  // Peaked Black Lapels
  ctx.fillStyle = "#1e2638";
  ctx.beginPath();
  ctx.moveTo(cx - 17, torsoY);
  ctx.lineTo(cx - 8, torsoY + 15);
  ctx.lineTo(cx - 15, torsoY + 17);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + 17, torsoY);
  ctx.lineTo(cx + 8, torsoY + 15);
  ctx.lineTo(cx + 15, torsoY + 17);
  ctx.closePath();
  ctx.fill();

  // Crisp White Dress Shirt V-Opening
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(cx - 8, torsoY);
  ctx.lineTo(cx + 8, torsoY);
  ctx.lineTo(cx + 4.5, torsoY + 16);
  ctx.lineTo(cx - 4.5, torsoY + 16);
  ctx.closePath();
  ctx.fill();

  // Royal Blue Executive Necktie
  const tieFlapAmount = Math.sin(runFrame * 1.6) * 4.5;
  ctx.fillStyle = boostActive ? "#facc15" : "#1d4ed8";
  // Tie knot
  ctx.fillRect(cx - 3, torsoY + 1, 6, 4);
  // Tie blade
  ctx.fillStyle = boostActive ? "#fef08a" : "#2563eb";
  ctx.beginPath();
  ctx.moveTo(cx - 3, torsoY + 5);
  ctx.lineTo(cx + 3, torsoY + 5);
  ctx.lineTo(cx + 3.5 - tieFlapAmount, torsoY + 19);
  ctx.lineTo(cx - tieFlapAmount, torsoY + 23);
  ctx.lineTo(cx - 3.5 - tieFlapAmount, torsoY + 19);
  ctx.closePath();
  ctx.fill();

  // Two Gold Buttons down the front waistcoat
  ctx.fillStyle = "#facc15";
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 1;
  // Button 1
  ctx.beginPath();
  ctx.arc(cx - 0.5, torsoY + 14, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Button 2
  ctx.beginPath();
  ctx.arc(cx - 0.5, torsoY + 20, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // --- FRONT ARM (RIGHT ARM & ARTICULATED GREEN FROG HAND) ---
  let frontArmAngle: number;
  let frontHandX: number;
  let frontHandY: number;

  if (mode === "catch") {
    // In Fry Catcher mode, hands are held open upwards ready to catch fries!
    const catchBounce = Math.sin(runFrame * 2) * 3.5;
    frontHandX = cx + 20;
    frontHandY = torsoY + 9 + catchBounce;
  } else if (isJumping) {
    frontArmAngle = 0.55;
    frontHandX = cx + 18;
    frontHandY = torsoY + 11;
  } else {
    frontArmAngle = -armCycle * 0.8;
    const frontShoulderX = cx + 13;
    const frontShoulderY = torsoY + 6;
    frontHandX = frontShoulderX - Math.sin(frontArmAngle) * 18;
    frontHandY = frontShoulderY + Math.cos(frontArmAngle) * 15;
  }

  // Front Suit Sleeve
  ctx.strokeStyle = suitColor;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + 13, torsoY + 6);
  ctx.lineTo(frontHandX, frontHandY);
  ctx.stroke();

  // White Shirt Cuff
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(frontHandX, frontHandY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Gold Sleeve Cufflink
  ctx.fillStyle = "#facc15";
  ctx.fillRect(frontHandX - 1, frontHandY - 2, 2.5, 2.5);

  // Front Green Frog Hand with 4 Articulated Digits/Fingers
  ctx.fillStyle = "#5ba138";
  ctx.beginPath();
  ctx.arc(frontHandX + 1, frontHandY + 2, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // 4 distinct articulated frog fingers spread out moving in stride!
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = "#5ba138";
  ctx.lineCap = "round";
  ctx.beginPath();
  // Finger 1 (pointing forward)
  ctx.moveTo(frontHandX + 1, frontHandY);
  ctx.lineTo(frontHandX + 8, frontHandY - 1);
  // Finger 2 (middle finger)
  ctx.moveTo(frontHandX + 2, frontHandY + 2);
  ctx.lineTo(frontHandX + 9, frontHandY + 3);
  // Finger 3 (lower finger)
  ctx.moveTo(frontHandX + 1, frontHandY + 4);
  ctx.lineTo(frontHandX + 7, frontHandY + 7);
  // Thumb/Digit 4
  ctx.moveTo(frontHandX, frontHandY + 4);
  ctx.lineTo(frontHandX + 4, frontHandY + 9);
  ctx.stroke();

  // --- PEPE FROG HEAD & FACIAL FEATURES ---
  const headCx = cx;
  const headCy = headY + 11;

  // Head Base: Classic wide squat frog head
  ctx.fillStyle = "#5ba138";
  ctx.beginPath();
  ctx.ellipse(headCx, headCy, 21, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#122b10";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Emerald Cheek Brooch / Jewel (on right cheek / viewer's left, exactly like the image)
  ctx.fillStyle = "#0a2610";
  ctx.beginPath();
  ctx.arc(headCx - 13, headCy + 2, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(headCx - 13, headCy + 2, 3.2, 0, Math.PI * 2);
  ctx.fill();
  // Shiny emerald glint
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(headCx - 14.5, headCy + 0.5, 1.8, 1.8);

  // Classic Smug Pepe Mouth with Terracotta/Brown Frog Lips
  ctx.strokeStyle = "#7c3a22";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(headCx - 7, headCy + 8);
  ctx.lineTo(headCx + 14, headCy + 7);
  ctx.lineTo(headCx + 17, headCy + 5); // Smug upturned smirk
  ctx.stroke();

  // --- PEPE BULGING EYES & DROOPY EYELIDS ---
  // Left eye frog socket bump
  ctx.fillStyle = "#5ba138";
  ctx.beginPath();
  ctx.arc(headCx - 8, headCy - 3, 9.5, 0, Math.PI * 2);
  ctx.arc(headCx + 10, headCy - 3, 9.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#122b10";
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // White of Eyes (sclera)
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(headCx - 8, headCy - 3, 7, 0, Math.PI * 2);
  ctx.arc(headCx + 10, headCy - 3, 7, 0, Math.PI * 2);
  ctx.fill();

  // Black pupils looking sideways/forward
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(headCx - 6, headCy - 3, 3.2, 0, Math.PI * 2);
  ctx.arc(headCx + 12, headCy - 3, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Droopy upper eyelids (Classic iconic Pepe look)
  ctx.fillStyle = "#4a862b";
  ctx.beginPath();
  ctx.arc(headCx - 8, headCy - 4, 7.2, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headCx + 10, headCy - 4, 7.2, Math.PI, 0);
  ctx.fill();

  // Eye glint
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(headCx - 7, headCy - 4, 1.5, 1.5);
  ctx.fillRect(headCx + 11, headCy - 4, 1.5, 1.5);

  // --- ICONIC WHITE RECTANGULAR GLASSES / SPECTACLES WITH BRIDGE ---
  // Exactly matching the reference image!
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  // Left rectangular frame
  ctx.strokeRect(headCx - 17, headCy - 8, 15, 11);
  // Right rectangular frame
  ctx.strokeRect(headCx + 2, headCy - 8, 15, 11);

  // Thick white bridge across the nose connecting both lenses
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(headCx - 3.5, headCy - 5, 7, 3);
  // White nose highlight / reflection
  ctx.fillRect(headCx - 2, headCy - 1.5, 5, 2.2);

  // --- CROWN OF CRISPY FRENCH FRIES ON THE HEAD ---
  // Individual golden crispy fries crowned on his head
  const frySway = Math.sin(runFrame * 1.5) * 0.06;
  const frySticks = [
    { x: headCx - 14, y: headCy - 28, w: 3.8, h: 15, angle: -0.22 + frySway },
    { x: headCx - 8, y: headCy - 33, w: 4.2, h: 20, angle: -0.09 + frySway },
    { x: headCx - 1, y: headCy - 36, w: 4.8, h: 23, angle: 0.02 + frySway },
    { x: headCx + 6, y: headCy - 32, w: 4.2, h: 19, angle: 0.12 + frySway },
    { x: headCx + 13, y: headCy - 27, w: 3.8, h: 14, angle: 0.25 + frySway },
  ];

  frySticks.forEach((fry) => {
    ctx.save();
    ctx.translate(fry.x + fry.w / 2, fry.y + fry.h);
    ctx.rotate(fry.angle);
    // Golden fry body
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(-fry.w / 2, -fry.h, fry.w, fry.h);
    // Toasted crispy tip
    ctx.fillStyle = "#d97706";
    ctx.fillRect(-fry.w / 2, -fry.h, fry.w, 4.5);
    // Dark burnt apex
    ctx.fillStyle = "#78350f";
    ctx.fillRect(-fry.w / 2, -fry.h, fry.w, 1.8);
    // Fry border
    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 1;
    ctx.strokeRect(-fry.w / 2, -fry.h, fry.w, fry.h);
    ctx.restore();
  });

  // --- GENTLEMAN'S BLACK SILK TOP HAT ---
  // Flat-topped tall cylinder crown
  const hatWidth = 28;
  const hatHeight = 18;
  const hatX = headCx - hatWidth / 2;
  const hatY = headCy - 26;

  ctx.fillStyle = "#111624";
  ctx.fillRect(hatX, hatY, hatWidth, hatHeight);
  // Silk sheen vertical reflection stripe
  ctx.fillStyle = "#27344f";
  ctx.fillRect(hatX + 3, hatY + 1, 4, hatHeight - 2);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(hatX, hatY, hatWidth, hatHeight);

  // Silk Hat Band (charcoal/navy ribbon right above brim)
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(hatX, hatY + hatHeight - 5.5, hatWidth, 5.5);
  // Shiny Gold Buckle
  ctx.fillStyle = "#facc15";
  ctx.fillRect(headCx - 2.5, hatY + hatHeight - 5, 5, 4.5);
  ctx.fillStyle = "#78350f";
  ctx.fillRect(headCx - 1, hatY + hatHeight - 3.5, 2, 2);

  // Wide Curved Hat Brim extending past head edges
  const brimWidth = 42;
  const brimHeight = 5;
  const brimX = headCx - brimWidth / 2;
  const brimY = headCy - 9;

  ctx.fillStyle = "#0a0e17";
  ctx.fillRect(brimX, brimY, brimWidth, brimHeight);
  // Brim highlight
  ctx.fillStyle = "#27344f";
  ctx.fillRect(brimX + 2, brimY + 0.5, brimWidth - 4, 1.5);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.8;
  ctx.strokeRect(brimX, brimY, brimWidth, brimHeight);

  ctx.restore();
}
