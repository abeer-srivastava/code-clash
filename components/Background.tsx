import PixelBlast from "./PixelBlast";

export default function Background({children}:{children:React.ReactNode}) {
    return <div className="relative w-full min-h-screen">
    <div className="pointer-events-none absolute inset-0 z-[-1] bg-black">
    <PixelBlast
    variant="square"
    pixelSize={5}
    color="#FFA000"
    patternScale={3}
    patternDensity={1.2}
    pixelSizeJitter={0.3}
    enableRipples
    rippleSpeed={0.4}
    rippleThickness={0.12}
    rippleIntensityScale={1.5}
    speed={0.7}
    edgeFade={0.25}
    transparent
  />
    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black"></div>
    </div>
    {children}
    </div>;
}