"use client";
import { MouseEvent, useEffect, useRef } from "react";
import MagicWand from "magic-wand-tool";
import { useWindowSize } from "@uidotdev/usehooks";
import styles from "./cranyon.module.css";

const colorThreshold = 30;
const blurRadius = 10;
const hatchLength = 4;
const hatchOffset = 0;

// from jQuery source code, equivalent to $(x).offset()
function getOffset(e: EventTarget & HTMLCanvasElement) {
  if (!e.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  const rect = e.getBoundingClientRect();
  const win = e.ownerDocument.defaultView;

  if (
    typeof win?.pageYOffset === "number" &&
    typeof win?.pageXOffset === "number"
  ) {
    return {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset,
    };
  }
}

function getMousePosition(e: any) {
  const p = getOffset(e.target);
  const xRelativeToScaledImage = Math.round(
    (e.clientX || e.pageX) - (p ? p.left : 0)
  );
  const yRelativeToScaledImage = Math.round(
    (e.clientY || e.pageY) - (p ? p.top : 0)
  );
  return { x: xRelativeToScaledImage, y: yRelativeToScaledImage };
}

const drawBorder = ({
  canvas,
  mask,
  width,
  height,
  noBorder,
}: {
  mask: any;
  width: number;
  height: number;
  canvas: HTMLCanvasElement | null;
  noBorder?: boolean;
}) => {
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    const imgData = ctx.createImageData(width, height);
    const res = imgData.data;
    let cacheInd;

    if (!noBorder) cacheInd = MagicWand.getBorderIndices(mask);

    ctx.clearRect(0, 0, width, height);

    for (let j = 0; j < cacheInd.length; j++) {
      const i = cacheInd[j];
      const x = i % width; // calc x by index
      const y = (i - x) / width; // calc y by index
      const k = (y * width + x) * 4;
      if ((x + y + hatchOffset) % (hatchLength * 2) < hatchLength) {
        // detect hatch color
        res[k + 3] = 255; // black, change only alpha
      } else {
        res[k] = 255; // white
        res[k + 1] = 255;
        res[k + 2] = 255;
        res[k + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }
};

export default function Cranyon({}) {
  const mask = useRef<any>();
  const oldMask = useRef<any>();

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width: browserWindowWidth, height: browserWindowHeight } =
    useWindowSize();

  useEffect(() => {
    if (imgRef.current && canvasRef.current) {
      const { width, height } = imgRef.current;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  }, [browserWindowWidth, browserWindowHeight]);

  const drawMask = (x: number, y: number) => {
    const currentThreshold = colorThreshold;

    const tempCtx = document.createElement("canvas").getContext("2d");
    if (tempCtx && imgRef.current) {
      const { width, height } = imgRef.current;
      tempCtx.canvas.width = width;
      tempCtx.canvas.height = height;
      tempCtx.drawImage(imgRef.current, 0, 0, width, height);
      const imagedata = tempCtx.getImageData(0, 0, width, height);

      const image = {
        data: imagedata.data,
        width,
        height,
        bytes: 4,
      };

      // if (!oldMask.current) {
      //   oldMask.current = mask.current;
      // }

      let old = null; //oldMask.current ? oldMask.current.data : null;

      console.log("about to MagicWand.floodFill");
      let newMask = MagicWand.floodFill(
        image,
        x,
        y,
        currentThreshold,
        old,
        true
      );
      if (newMask) {
        console.log("about to MagicWand.gaussBlurOnlyBorder");
        newMask = MagicWand.gaussBlurOnlyBorder(newMask, blurRadius, old);
      }
      // if (addMode && oldMask) {
      //   newMask = newMask ? concatMasks(newMask, oldMask) : oldMask;
      // }
      mask.current = newMask;

      drawBorder({ mask: newMask, width, height, canvas: canvasRef.current });
    }
  };

  const onMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (e.button == 0 && imgRef.current) {
      const downPoint = getMousePosition(e);
      drawMask(downPoint.x, downPoint.y);
    }
  };

  const isImageTallerThanWide = true;
  const fitImageToScreenCss = isImageTallerThanWide
    ? { height: "100%" }
    : { width: "100%" };

  return (
    <div className={styles.wrapper}>
      <img
        id="test-picture"
        ref={imgRef}
        src="https://s3.amazonaws.com/pics.cranyons.com/houseaccess.jpg"
        className={styles.picture}
        style={fitImageToScreenCss}
        crossOrigin="anonymous"
      />
      <canvas
        id="resultCanvas"
        ref={canvasRef}
        className={styles.canvas}
        style={fitImageToScreenCss}
        onMouseDown={onMouseDown}
      ></canvas>
    </div>
  );
}
