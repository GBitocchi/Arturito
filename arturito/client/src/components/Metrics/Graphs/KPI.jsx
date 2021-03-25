import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const style = theme =>({
  kpiContent: {
    width: 300,
    height: 180,
    marginTop: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


function SimpleCard(props) {
  const {classes, gadget} = props;
  const valDisplay = ((gadget.seconds - gadget.artifacts) / (gadget.seconds)) * 100;
  const roundedVal = Math.round(valDisplay * 100) / 100
  const bull = <span className={classes.bullet}>•</span>;

  return (
      <div className={classes.kpiContent}>
        <Typography variant="h5" component="h1" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#34a5e1',
          fontSize: '5em',
        }}>
          {roundedVal} %
        </Typography>
      </div>


  );
}

export default withStyles(style)(SimpleCard)
