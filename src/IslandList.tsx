import * as React from "react";
import { net, remote } from "electron";
import * as moment from 'moment'

type MyState = {
  isLoading: boolean,
  buffer: string;
  islands: Island[];
  loadingDate: string;
}

export class IslandList extends React.Component<{}, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      islands: [],
      buffer: "",
      loadingDate: undefined
    };
  }

  filterIslands(islands: Island[]): Island[] {
    return islands
      .filter(i => i.queued.startsWith("0"))
      .sort((a, b) => b.turnipPrice - a.turnipPrice)
      .slice(0, 5);
  }

  componentDidMount() {
    var mainRequest = remote.net.request("https://turnip.exchange/islands");

    mainRequest.on('response', (response) => {
      var _this = this;

      remote.session.defaultSession.cookies.get({ url: 'https://api.turnip.exchange' })
        .then(cookies => {
          var apiRequest = remote.net.request({
            method: 'POST',
            url: "https://api.turnip.exchange/islands/"
          });

          apiRequest.on('response', apiResponse => {
            apiResponse.on("data", function (data) {
              _this.setState({ buffer: _this.state.buffer + data });
            });
            apiResponse.on("end", function (data) {
              let turnipExchangeResponse: TurnipExchangeResponse = JSON.parse(_this.state.buffer);

              _this.setState({
                islands: _this.filterIslands(turnipExchangeResponse.islands),
                buffer: "",
                loadingDate: moment(Date.now()).format('LTS'),
                isLoading: false
              });
            });
          })

          apiRequest.write("{\"islander\":\"neither\",\"category\":\"turnips\"}");
          apiRequest.end();
        });
    });

    mainRequest.end();
  }

  render() {
    if (this.state.isLoading) {
      return <div>
        <div className="text-center">
          <p>The best islands on <a href="#" onClick={() => {remote.shell.openExternal("https://turnip.exchange"); return false; }}>turnip.exchange</a>!</p>
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <h3>Loading...</h3>
          </div>
        </div>
      </div>
    }
    else {
      const islandsDiv = this.state.islands.map((island, index) =>
        <div key={index}>
          <div className="row">
            <div className="col-2 text-center">
              <h3><a href="#" onClick={() => {remote.shell.openExternal("https://turnip.exchange/island/" + island.turnipCode); return false;}}>{island.turnipPrice}&nbsp;bells</a></h3>
              <h6>({island.name})</h6>
            </div>
            <div className="col-10">
              {island.description}
            </div>
          </div>
          <br />
          <br />
        </div>
      );

      return <div className="electron-no-drag">
        <div className="text-center">
          <p>The best islands on <a href="#" onClick={() => {remote.shell.openExternal("https://turnip.exchange"); return false; }}>turnip.exchange</a> at <a href="#" onClick={() => remote.getCurrentWindow().reload()} title="Reload page">{this.state.loadingDate}</a>!</p>
        </div>
        {islandsDiv}
      </div>
    }
  }
}