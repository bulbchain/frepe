import React, { useState } from "react";
import {
  X,
  ArrowDown,
  Flame,
  Fuel,
  ExternalLink,
  Wrench,
} from "lucide-react";
import { sound } from "../audio";

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [solAmount, setSolAmount] = useState<string>("1.5");

  if (!isOpen) return null;

  const pumpFunUrl = "https://pump.fun/";

  return (
    <div
      id="swap-modal-overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        id="swap-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#131b2e] border-4 border-black rounded-3xl w-full max-w-md shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 bg-[#060e20] border-b-2 border-[#2d3449] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#facc15] text-[#3c2f00] flex items-center justify-center text-lg font-black border border-black -rotate-3">
              🍟
            </span>

            <div>
              <h3 className="font-headline text-lg text-[#ffecb9] uppercase font-black">
                SWAP FOR $FREPE
              </h3>

              <span className="font-mono-code text-[10px] text-[#4ae176] font-bold">
                SWAP ENGINE • IN PROGRESS
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#222a3d] hover:bg-[#93000a] text-[#dae2fd] border border-[#2d3449] cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Swap In Progress Banner */}
          <div className="mx-5 mt-4 bg-[#facc15] rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000] overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-10 h-10 shrink-0 rounded-xl bg-black text-[#facc15] flex items-center justify-center border-2 border-black">
                  <Wrench className="w-5 h-5" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline text-base text-[#231b00] uppercase font-black">
                      SWAP IN PROGRESS
                    </h4>

                    <span className="w-2 h-2 rounded-full bg-[#4ae176] animate-pulse shrink-0" />
                  </div>

                  <p className="text-[11px] text-[#3c2f00] font-medium leading-relaxed mt-1">
                    Our native FREPE swap is being cooked. Until
                    it's ready, grab $FREPE directly on Pump.fun.
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="shrink-0 w-8 h-8 rounded-lg bg-black text-[#facc15] hover:bg-[#131b2e] flex items-center justify-center border-2 border-black transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pump.fun Button */}
              <a
                href={pumpFunUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playBoost()}
                className="mt-3 w-full bg-black text-[#facc15] hover:bg-[#131b2e] font-headline text-sm uppercase py-3 rounded-xl border-2 border-black font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_#3c2f00] transition-all hover:-translate-y-0.5"
              >
                <Flame className="w-4 h-4" />
                BUY $FREPE ON PUMP.FUN
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Swap Form */}
          <div className="p-5 flex flex-col gap-3">
            {/* You Pay */}
            <div className="bg-[#060e20] rounded-xl p-3 border-2 border-[#2d3449] flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono-code text-[#9a9078]">
                <span>YOU PAY</span>
                <span>BALANCE: 14.20 SOL</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.01"
                  value={solAmount}
                  onChange={(e) => setSolAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl font-headline font-black text-[#ffecb9] outline-none"
                  placeholder="0.0"
                />

                <div className="flex items-center gap-1.5 bg-[#171f33] px-3 py-1.5 rounded-lg border border-[#2d3449] text-xs font-mono-code font-bold text-[#dae2fd] shrink-0">
                  {/* <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] text-black text-[10px] flex items-center justify-center font-bold">
                    ◎
                  </span> */}
                  <span>SOL</span>
                </div>
              </div>
            </div>

            {/* Arrow Divider */}
            <div className="flex justify-center -my-1 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#facc15] text-[#3c2f00] flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000000]">
                <ArrowDown className="w-4 h-4 font-black" />
              </div>
            </div>

            {/* You Receive */}
            <div className="bg-[#060e20] rounded-xl p-3 border-2 border-[#2d3449] flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono-code text-[#9a9078]">
                <span>YOU RECEIVE (ESTIMATED)</span>
                <span className="text-[#4ae176]">0% TAX</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl font-headline font-black text-[#facc15] truncate">
                  —
                </span>

                <div className="flex items-center gap-1.5 bg-[#facc15] text-[#3c2f00] px-3 py-1.5 rounded-lg border border-black text-xs font-mono-code font-black shrink-0 shadow-[2px_2px_0px_#000000]">
                  <span>🍟</span>
                  <span>$FREPE</span>
                </div>
              </div>
            </div>

            {/* Swap Info Details */}
            <div className="p-3 rounded-lg bg-[#171f33] border border-[#2d3449] font-mono-code text-xs flex flex-col gap-2 text-[#9a9078]">
              <div className="flex justify-between">
                <span>Exchange Rate:</span>
                <span className="text-[#9a9078]">
                  Available after launch
                </span>
              </div>

              <div className="flex justify-between">
                <span>Network Fee:</span>
                <span className="text-[#9a9078]">
                  Calculated at swap
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Token:</span>
                <span className="text-[#dae2fd]">
                  $FREPE
                </span>
              </div>
            </div>

            {/* Disabled Swap Button */}
            <button
              id="confirm-swap-action-btn"
              disabled
              className="w-full bg-[#2d3449] text-[#9a9078] font-headline text-lg uppercase py-3.5 rounded-xl border-2 border-[#3b4358] font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-70"
            >
              <Flame className="w-5 h-5" />
              SWAP COMING SOON
            </button>

            {/* Pump.fun Link */}
            <a
              href={pumpFunUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playBoost()}
              className="text-center font-mono-code text-xs text-[#9a9078] hover:text-[#facc15] flex items-center justify-center gap-1 mt-1 transition-colors"
            >
              <span>Open FREPE on Pump.fun</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};