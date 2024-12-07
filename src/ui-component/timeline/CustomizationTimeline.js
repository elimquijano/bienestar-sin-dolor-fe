import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Fab, Grid, Paper, Stack } from '@mui/material';
import { ArrowForwardIos, Check, EmojiEvents } from '@mui/icons-material';

const Calendar = ({ sessions }) => {
  const allCompleted = sessions.every((obj) => obj.completed === true);
  return (
    <Paper className="p-3 m-2">
      <Grid container spacing={1}>
        {sessions.map((session, index) => (
          <Grid item xs={4} key={index}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Fab
                color="secondary"
                onClick={() => {
                  console.log(session.id);
                }}
                disabled={!session.available}
                size="small"
              >
                {index + 1}
              </Fab>
              <span className="px-2">
                <ArrowForwardIos fontSize="small" />
              </span>
            </Stack>
          </Grid>
        ))}
        <Grid item xs={4}>
          <Stack direction="row" alignItems="center" justifyContent="start">
            <Fab color="secondary" disabled={!allCompleted} size="small">
              <EmojiEvents />
            </Fab>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default function CustomizedTimeline({ items = [], daysPerWeek = 3 }) {
  const theme = useTheme();
  const semanas = groupInNumber(items, daysPerWeek);
  console.log(semanas);

  function groupInNumber(array, number) {
    const groups = [];
    for (let i = 0; i < array.length; i += number) {
      groups.push(array.slice(i, i + number));
    }
    return groups;
  }

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0
        }
      }}
    >
      {semanas.map((semana, index) => {
        const allCompleted = !semana.every((obj) => obj.available === false);
        const isViewConnector = index !== semanas.length - 1;
        return (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color={allCompleted ? 'secondary' : 'grey'} variant={allCompleted ? 'filled' : 'outlined'}>
                <Check />
              </TimelineDot>
              {isViewConnector && (
                <TimelineConnector sx={{ backgroundColor: allCompleted ? theme.palette.secondary.main : theme.palette.grey[400] }} />
              )}
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h4" component="span" color={allCompleted ? theme.palette.secondary.main : theme.palette.grey[400]}>
                {`SEMANA ${index + 1}`}
              </Typography>
              <Calendar sessions={semana} />
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
