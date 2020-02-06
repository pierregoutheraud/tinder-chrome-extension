class Tinder {
  constructor() {
    this.url = "https://api.gotinder.com";
  }

  setToken(token) {
    console.log("api setToken", token);
    this.xAuthToken = token;
  }

  getHeaders() {
    return {
      "X-Auth-Token": this.xAuthToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "app-version": "1020313",
      platform: "web",
      "x-supported-image-formats": "webp,jpeg",
    };
  }

  get(path) {
    return new Promise(resolve => {
      const url = this.url + path;
      chrome.runtime.sendMessage(
        { type: "FETCH", method: "GET", url, headers: this.getHeaders() },
        data => {
          resolve(data);
        }
      );
    });

    /*
    return window
      .fetch(url, {
        headers: this.getHeaders(),
      })
      .then(res => res.json())
      .then(json => {
        return json.data;
      });
      */
  }

  post(path, data) {
    return new Promise(resolve => {
      const url = this.url + path;
      chrome.runtime.sendMessage(
        {
          type: "FETCH",
          method: "POST",
          url,
          headers: this.getHeaders(),
          data,
        },
        data => {
          resolve(data);
        }
      );
    });

    /*
    const url = this.url + path;
    return window.fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    */
  }

  fetchMatches(pageToken = null) {
    const pageTokenQueryParam =
      pageToken !== null ? `&page_token=${pageToken}` : "";
    // return this.get(`/v2/matches?count=100${pageTokenQueryParam}`);
    return this.get(
      `/v2/matches?count=100&is_tinder_u=false&locale=en&message=0${pageTokenQueryParam}`
      // `/v2/matches?count=100&is_tinder_u=false&locale=en&message=1${pageTokenQueryParam}`
    );
  }

  wait(duration = 1000) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  async sendMessages(message, matches, onlyToNew = false, callback = () => {}) {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const { messages } = match;
      const m = message.replace("*name*", match.person.name);
      let data = {
        // message: `Hello ${match.person.name} 👋 Tu t'occupes comment ce soir?`,
        message: m,
      };

      console.log(messages.length);
      if (!onlyToNew || (onlyToNew && !messages.length)) {
        console.log(`Send message to ${match.person.name}`, data.message);
        // await this.post(`/user/matches/${match._id}`, data);
        await this.wait(100);
        callback(i + 1, matches.length);
      }
    }
    return true;

    /*
    return Promise.all(
      matches.map(match => {
        const m = message.replace("*name*", match.person.name);
        console.log("Send message to", match._id);
        const data = {
          message: m,
        };
        return this.post(`/user/matches/${match._id}`, data);
      })
    );
    */
  }

  async fetchAllMatches() {
    console.log("getAllMatches...");
    let allMatches = [];
    let end = false;
    let nextPageToken = null;
    while (!end) {
      let data;
      try {
        data = await this.fetchMatches(nextPageToken);
        allMatches = [...allMatches, ...data.matches];
        if (data.next_page_token) {
          nextPageToken = data.next_page_token;
        } else {
          end = true;
        }
      } catch (e) {
        console.log("Error getAllMatches", e);
        break;
      }
    }
    console.log("getAllMatches... done.");
    return allMatches;
  }

  async getRecs() {
    const data = await this.get(`/v2/recs/core?count=100`);
    return data.results;
  }
}

module.exports = new Tinder();
