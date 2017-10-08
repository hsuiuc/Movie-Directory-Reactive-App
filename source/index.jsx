import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css';
import { Button } from 'semantic-ui-react'

// Include your new Components here
import Search from "./components/Search/Search.jsx";
import Gallery from "./components/Gallery/Gallery.jsx";
import Detail from "./components/Detail/Detail.jsx"

// Include any new stylesheets here
// Note that components' stylesheets should NOT be included here.
// They should be 'require'd in their component class file.
require('./styles/main.scss');

render(
    //<Home />,
    <Router>
        <div>
            <h1>Welcome to Movie Directory!</h1>
            <Button>
                <Link to="/Search">Search</Link>
            </Button>
            <Button>
                <Link to="/Gallery">Gallery</Link>
            </Button>

            <hr/>

            <Route path="/Search" component={Search}/>
            <Route path="/Gallery" component={Gallery}/>
            <Route path="/Detail/:passedProps" component={Detail}/>
        </div>
    </Router>,

    // Define your router and replace <Home /> with it!
    document.getElementById('app')
);
