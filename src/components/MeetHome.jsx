import React, { Component, useState } from 'react';
{/*
import { Input, Button } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
*/}

import { Input, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

class MeetHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };
  }

  handleChange = (e) => this.setState({ url: e.target.value });

  join = () => {
    const { url } = this.state;
    if (url) {
      const lastSegment = url.split('/').pop();
      window.location.href = `/${lastSegment}`;
    } else {
      const randomUrl = Math.random().toString(36).substring(2, 7);
      window.location.href = `/${randomUrl}`;
    }
  };

  render() {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="bg-white text-black text-sm w-1/10 mx-auto py-2 mb-4">
          Source code:
          <a
            href="https://github.com/0x5eba/Video-Meeting"
            className="text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </a>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Video Meeting</h1>
          <p className="font-light">Video conference website that lets you stay in touch with all your friends.</p>
        </div>

        <div className="bg-white w-3/10 h-auto p-5 min-w-400 mx-auto mt-20">
          <p className="font-bold pr-10 mb-0">Start or join a meeting</p>
          <Input
            placeholder="URL"
            onChange={(e) => this.handleChange(e)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.join}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go
          </Button>
        </div>
      </div>
    );
  }
}

export default MeetHome;
