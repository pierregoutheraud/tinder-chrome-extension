class Tinder {
  constructor() {
    this.url = "https://api.gotinder.com";
  }

  setToken(token) {
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
    const url = this.url + path;
    return fetch(url, {
      headers: this.getHeaders(),
    })
      .then(res => res.json())
      .then(json => {
        return json.data;
      });
  }

  post(path, data) {
    const url = this.url + path;
    return fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
  }

  fetchMatches(pageToken = null) {
    const pageTokenQueryParam =
      pageToken !== null ? `&page_token=${pageToken}` : "";
    return this.get(`/v2/matches?count=100${pageTokenQueryParam}`);
  }

  wait(duration = 1000) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  async sendMessage(message, matches) {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const { messages } = match;
      const m = message.replace("*name*", match.person.name);
      let data = {
        // message: `Hello ${match.person.name} 👋 Tu t'occupes comment ce soir?`,
        message: m,
      };

      console.log(`Send message to ${match.person.name}\n`, data.message);
      await this.post(`/user/matches/${match._id}`, data);
      await this.wait(100);

      // if (!messages.length) {
      //   await this.post(`/user/matches/${match._id}`, data);
      //   await this.wait(100);
      // }

      /*
      const hasMessage =
        messages.length &&
        messages.some(m => {
          return m.message.includes("Hello Justine! Tu t'occupes");
        });
      if (hasMessage) {
        let data = {
          message: `oula j'ai craqué moi, c'est qui Justine ? :v`,
        };
        await this.post(`/user/matches/${match._id}`, data);
      } else {
        // await this.post(`/user/matches/${match._id}`, data);
      }
      */
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

  async getAllMatches() {
    let matches = [];
    let end = false;
    let nextPageToken = null;
    while (!end) {
      console.log("Fetching matches...");
      const data = await this.fetchMatches(nextPageToken);
      matches = [...matches, ...data.matches];
      if (data.next_page_token) {
        nextPageToken = data.next_page_token;
      } else {
        end = true;
      }
    }
    return matches;
  }

  async getRecs() {
    const data = await this.get(`/v2/recs/core?count=100`);
    return data.results;
  }
}

module.exports = new Tinder();
