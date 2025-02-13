import { PureComponent } from 'react';
import { origin } from "../../../project.config.json";
import Cookies from 'utils/modules/Cookies';

class Ping extends PureComponent {
  intervalId: NodeJS.Timeout | null = null;
  pingEndpoint = `${origin}/auth/ping/`;

  componentDidMount() {
    // Start pinging after a 1-second delay, then every 30 seconds.
    setTimeout(() => {
      this.sendPing();
      this.intervalId = setInterval(this.sendPing, 30000);
    }, 1000);

    window.addEventListener('beforeunload', this.sendFinalPing);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    window.removeEventListener('beforeunload', this.sendFinalPing);
    this.sendFinalPing();
  }

  sendFinalPing = () => {
    // Only send a final ping if a session cookie exists.
    if (Cookies.getCookie('sessionid')) {
      navigator.sendBeacon(this.pingEndpoint);
    }
  };

  sendPing = async () => {
    try {
      const response = await fetch(this.pingEndpoint, {
        method: 'GET',
        credentials: 'include', // Ensures that the session cookie is sent.
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Ping error:', error);
    }
  };

  render() {
    return null;
  }
}

export default Ping;
