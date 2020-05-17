import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IslandList } from './IslandList';
import Container from 'react-bootstrap/Container';
import 'bootstrap';
import './react.scss';
import { remote } from "electron";

const Index = () => {
    return <div>
        <header className="electron-drag" id="header">
            <nav className="navbar fixed-top navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <Container>
                    <a className="navbar-brand electron-no-drag" href='#' onClick={() => remote.getCurrentWindow().reload()}>Navelsk</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </Container>
                <div>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link electron-no-drag" href="#" onClick={() => remote.app.quit()}>Quit</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <Container>
            <main role="main" className="pb-3 pt-3">
                <p><br/><br/></p>
                <IslandList></IslandList>
            </main>
        </Container>
        <footer className="border-top footer text-muted fixed-bottom">
            <div className="container">
                &copy; 2020 - Navelsk by <a href="#" onClick={() => {remote.shell.openExternal("https://twitter.com/a1izee"); return false;}}>Alizee</a>
            </div>
        </footer>
    </div>
};

ReactDOM.render(<Index />, document.getElementById('app'));
