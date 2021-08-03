import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import SignIn from './SignIn.js'

const styles = {
  list: {
    width: '33vw',
  },
};

class RightDrawer extends React.Component {
  state = {
    right: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        <SignIn/>
      </div>
    );

    return (
      <div>
        <Button onClick={this.toggleDrawer('right', true)}>Open Right</Button>
        <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false)}>
          {/* <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('right', false)}
            onKeyDown={this.toggleDrawer('right', false)}
          > */}
            {sideList}
          {/* </div> */}
        </Drawer>
      </div>
    );
  }
}

RightDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RightDrawer);
