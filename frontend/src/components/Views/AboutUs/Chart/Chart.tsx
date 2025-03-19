import styles from "./Chart.module.scss";
import { ReactNode } from "react";
import UIReact from "utils/classes/UIReact";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface AboutUsChartState {
    isMobile: boolean;
}

const rem = (value: number) => value * 16;
const data = [
    { year: "2020", "Рост продаж": 0, pv: 2400, amt: 2400 },
    { year: "2021", "Рост продаж": 3000, pv: 2400, amt: 2400 },
    { year: "2022", "Рост продаж": 2000, pv: 2400, amt: 2400 },
    { year: "2023", "Рост продаж": 5000, pv: 2400, amt: 2400 },
    { year: "2024", "Рост продаж": 4000, pv: 2400, amt: 2400 },
    { year: "2025", "Рост продаж": 6000, pv: 2400, amt: 2400 }
];


class AboutUsChart extends UIReact<{}, AboutUsChartState> {
    state: Readonly<AboutUsChartState> = {
        isMobile: window.innerWidth <= 768,
    };

    handleResize = () => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile !== this.state.isMobile) {
            this.setState({ isMobile });
        }
    };
    componentDidMount() {
        window.addEventListener("resize", this.handleResize, { signal: this.controller.signal });
    }
    
    render(): ReactNode {
        const { isMobile } = this.state;
        const tickFontSize = isMobile ? "0.65rem" : "0.875rem";
        return (
            <section className={styles["growthChart"]}>
                <div className={styles["chart-container"]}>
                    <h2 className={styles["chart-title"]}>Наши продажи в показателях</h2>
                    <div className={styles["chart-wrapper"]}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{
                                    top: rem(1.25),
                                    right: rem(2.5),
                                    bottom: rem(1.25),
                                    left: rem(1.25)
                                }}
                            >
                                <Line
                                    type="monotone"
                                    dataKey="Рост продаж"
                                    stroke="#F81155"
                                    strokeWidth={3}
                                    dot={{ r: rem(0.3125), strokeWidth: rem(0.125), fill: "#F81155" }}
                                    activeDot={{ r: rem(0.5) }}
                                />
                                <XAxis
                                    dataKey="year"
                                    stroke="#111"
                                    tick={{ fontSize: tickFontSize }}
                                    padding={{ left: rem(0.625), right: rem(0) }}
                                />
                                <YAxis
                                    stroke="#111"
                                    tick={{ fontSize: tickFontSize }}
                                    padding={{ bottom: rem(1.5) }}
                                />
                                <Tooltip
                                    formatter={(value: number) => [`${value}k`, "Рост продаж"]}
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "0.05rem solid #0000001A",
                                        borderRadius: "0.5rem",
                                        boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.1)",
                                        padding: "0.5rem 1rem",
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        )
    }
}

export default AboutUsChart;