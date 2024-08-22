import { useEffect, useMemo, useRef, useState } from "react";
import useAppCtx from "../state";
import { getData } from "../services/db/indexedDb";
// import { AuthActions, UserType } from "../reducer/authReducer";
// import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { StatsType } from "../reducer/gameReducer";
import { BarChart, LineChart } from "@mui/x-charts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type AllStats = {
  wpm: {
    series: number[];
    stats: { max: number; avg: number; last: number; sum: number };
  };
  accuracyData: {
    series: number[];
    stats: { max: number; avg: number; last: number; sum: number };
  };
  errorsData: {
    series: number[];
    stats: { max: number; avg: number; last: number; sum: number };
  };
  accurateWordsData: {
    series: number[];
    stats: { max: number; avg: number; last: number; sum: number };
  };
  xAxis: number[];
};

const Stats = () => {
  const color = "#1976D2";
  const [state] = useAppCtx();
  const [stats, setStats] = useState<StatsType[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartWidth, setChartWidth] = useState(600);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { auth } = state;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    getData<StatsType>("stats")
      .then((data) => {
        if (data) {
          const userStats = data.filter(
            (stat) => stat.username === auth.user?.username
          );
          setStats(userStats);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setIsLoading(false));
    // }
  }, []);

  const allStats = useMemo(() => {
    if (!stats || stats.length === 0) return null;
    return stats.reduce(
      (acc, curr, idx) => {
        acc.xAxis.push(idx + 1);
        acc.wpm.series.push(curr.wpm);
        acc.wpm.stats.max = Math.max(acc.wpm.stats.max, curr.wpm);
        acc.wpm.stats.last = curr.wpm;
        acc.wpm.stats.sum += curr.wpm;
        acc.wpm.stats.avg = acc.wpm.stats.sum / (idx + 1);

        acc.accuracyData.series.push(curr.accuracy);
        acc.accuracyData.stats.max = Math.max(
          acc.accuracyData.stats.max,
          curr.accuracy
        );
        acc.accuracyData.stats.last = curr.accuracy;
        acc.accuracyData.stats.sum += curr.accuracy;
        acc.accuracyData.stats.avg = acc.accuracyData.stats.sum / (idx + 1);

        acc.errorsData.series.push(curr.errors);
        acc.errorsData.stats.max = Math.max(
          acc.errorsData.stats.max,
          curr.errors
        );
        acc.errorsData.stats.last = curr.errors;
        acc.errorsData.stats.sum += curr.errors;
        acc.errorsData.stats.avg = acc.errorsData.stats.sum / (idx + 1);

        acc.accurateWordsData.series.push(curr.accurateWords!);
        acc.accurateWordsData.stats.max = Math.max(
          acc.accurateWordsData.stats.max,
          curr.accurateWords!
        );
        acc.accurateWordsData.stats.last = curr.accurateWords!;
        acc.accurateWordsData.stats.sum += curr.accurateWords!;
        acc.accurateWordsData.stats.avg =
          acc.accurateWordsData.stats.sum / (idx + 1);

        return acc;
      },
      {
        wpm: { series: [], stats: { max: 0, avg: 0, last: 0, sum: 0 } },
        accuracyData: {
          series: [],
          stats: { max: 0, avg: 0, last: 0, sum: 0 },
        },
        errorsData: {
          series: [],
          stats: { max: 0, avg: 0, last: 0, sum: 0 },
        },
        accurateWordsData: {
          series: [],
          stats: { max: 0, avg: 0, last: 0, sum: 0 },
        },
        xAxis: [],
      } as AllStats
    );
  }, [stats]);

  if (!allStats && isLoading) {
    return <Typography variant="h5">Loading...</Typography>;
  }
  if (!stats || stats.length === 0) {
    return <Typography variant="h5">No statistics yet</Typography>;
  }

  const barChartData = [
    {
      label: "WPM",
      ...allStats!.wpm.stats,
    },
    {
      label: "Accuracy (%)",
      ...allStats!.accuracyData.stats,
    },
    {
      label: "Errors",
      ...allStats!.errorsData.stats,
    },
    {
      label: "Acc Words (%)",
      ...allStats!.accurateWordsData.stats,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      headerAlign: "center",
      align: "center",
      valueFormatter: (value) =>
        new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      field: "wpm",
      headerName: "WPM",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "accuracy",
      headerName: "Accuracy(%)",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "errors",
      headerName: "Errors",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "accurateWords",
      headerName: "Acc. Words(%)",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "time",
      headerName: "Time (s)",
      headerAlign: "center",
      align: "center",
    },
  ];

  // return stats.length > 0 ? (
  return (
    <Box
      maxWidth={600}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      margin="0 auto"
    >
      <Box maxWidth={"100%"}>
        <DataGrid
          rows={stats}
          columns={columns}
          sx={{ marginBottom: "24px", border: 1 }}
          density="compact"
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5]}
          autoHeight
        />
      </Box>
      <Box width={"100%"}>
        <Typography variant="h6">Words per Minute</Typography>
        <LineChart
          //   width={300}
          height={300}
          xAxis={[
            { data: allStats!.xAxis, label: "Tests", scaleType: "point" },
          ]}
          yAxis={[
            {
              label: "Words per Minute",
            },
          ]}
          series={[
            {
              data: allStats!.wpm.series,
              label: "WPM",
              color: color,
            },
          ]}
        />
      </Box>

      <Box width={"100%"}>
        <Typography variant="h6">Accuracy</Typography>
        <LineChart
          height={300}
          xAxis={[
            {
              data: allStats!.xAxis,
              label: "Tests",
              scaleType: "point",
            },
          ]}
          yAxis={[{ label: "Accuracy (%)" }]}
          series={[
            {
              data: allStats!.accuracyData.series,
              label: "Accuracy",
              color: color,
            },
          ]}
        />
      </Box>

      <Box width={"100%"}>
        <Typography variant="h6">Errors</Typography>
        <LineChart
          xAxis={[
            {
              data: allStats!.xAxis,
              label: "Tests",
              scaleType: "point",
            },
          ]}
          yAxis={[{ label: "Errors" }]}
          series={[
            {
              data: allStats!.errorsData.series,
              label: "Errors",
              color: color,
            },
          ]}
          height={300}
        />
      </Box>

      <Box width={"100%"}>
        <Typography variant="h6">Accurate Words</Typography>
        <LineChart
          xAxis={[
            {
              data: allStats!.xAxis,
              label: "Tests",
              scaleType: "point",
            },
          ]}
          yAxis={[{ label: "Accurate Words  (%)" }]}
          series={[
            {
              data: allStats!.accurateWordsData.series,
              label: "Accurate Words",
              color: color,
            },
          ]}
          height={300}
        />
      </Box>

      <Box width={"100%"} ref={containerRef}>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: barChartData.map((d) => d.label),
            },
          ]}
          yAxis={[{ label: "Values" }]}
          series={[
            {
              data: barChartData.map((d) => d.max),
              label: "Max",
            },
            {
              data: barChartData.map((d) => d.avg),
              label: "Avg.",
            },
            {
              data: barChartData.map((d) => d.last),
              label: "Last",
            },
          ]}
          width={chartWidth!}
          height={300}
        />
      </Box>
    </Box>
  );
  // ) : (

  // );
  // }
};

export default Stats;
