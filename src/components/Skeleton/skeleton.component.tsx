function Skeleton({
    height,
    width,
    bg = "white",
    radius = "md",
}: {
    height: string;
    width: string;
    bg?: string;
    radius?: string;
}) {
    return (
        <div
            style={{ width: width, height: height, background: bg, opacity: "30%" }}
            className={`rounded-${radius} animate-pulse`}
        ></div>
    );
}
export default Skeleton;
